/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/service-inquiry/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/leads", () => ({
  upsertLead: jest.fn().mockResolvedValue({ id: "lead-3" }),
  addLeadNote: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue({}),
  notifyMarketer: jest.fn().mockResolvedValue({}),
}));

import { upsertLead, addLeadNote } from "@/lib/leads";

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

  it("returns 200 and creates a Prisma lead tagged as service_inquiry", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);

    expect(upsertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "bola@corp.com",
        company: "Acme Ltd",
        leadSource: "service_inquiry",
        serviceInterest: "corporate-training",
      }),
      1
    );
  });

  it("logs a services lead note", async () => {
    await POST(makeRequest(validPayload));
    expect(addLeadNote).toHaveBeenCalledWith(
      "lead-3",
      expect.stringContaining("Services lead")
    );
  });

  it("returns 400 for missing name or email", async () => {
    const res = await POST(makeRequest({ ...validPayload, name: "" }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 400 when consent is false", async () => {
    const res = await POST(makeRequest({ ...validPayload, consent: false }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("succeeds even when company is omitted (optional field)", async () => {
    const { company: _, ...noCompany } = validPayload;
    const res = await POST(makeRequest(noCompany));
    expect(res.status).toBe(200);
  });

  it("returns 500 when lead creation fails", async () => {
    (upsertLead as jest.Mock).mockRejectedValueOnce(new Error("DB error"));
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(500);
  });
});
