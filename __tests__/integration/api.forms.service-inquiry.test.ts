/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/service-inquiry/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/hubspot", () => ({
  upsertContact: jest.fn().mockResolvedValue({ id: "hs-789" }),
  addNote: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue({}),
  notifyMarketer: jest.fn().mockResolvedValue({}),
}));

import { upsertContact, addNote } from "@/lib/hubspot";
import { notifyMarketer } from "@/lib/email";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/forms/service-inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Bola Adeyemi",
  email: "bola@corp.com",
  company: "Acme Ltd",
  serviceInterest: "corporate-training",
  consent: true,
};

describe("POST /api/forms/service-inquiry", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 200 and tags the CRM record as a Services lead", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);

    expect(upsertContact).toHaveBeenCalledWith(
      expect.objectContaining({ email: "bola@corp.com", company: "Acme Ltd" })
    );
    expect(addNote).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("Services lead"),
      })
    );
    expect(notifyMarketer).toHaveBeenCalledTimes(1);
  });

  it("returns 400 for missing name or email", async () => {
    const res = await POST(makeRequest({ ...validPayload, name: "" }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 400 when consent is false", async () => {
    const res = await POST(makeRequest({ ...validPayload, consent: false }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("succeeds even when company is omitted (optional field)", async () => {
    const { company: _, ...noCompany } = validPayload;
    const res = await POST(makeRequest(noCompany));
    expect(res.status).toBe(200);
  });
});
