/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/general-contact/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/hubspot", () => ({
  upsertContact: jest.fn().mockResolvedValue({ id: "hs-101" }),
  addNote: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue({}),
  notifyMarketer: jest.fn().mockResolvedValue({}),
}));

import { upsertContact, addNote } from "@/lib/hubspot";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/forms/general-contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Chidi Okoro",
  email: "chidi@example.com",
  message: "I have a question about your programs.",
  consent: true,
};

describe("POST /api/forms/general-contact", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 200 and creates a CRM record for a valid submission", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);

    expect(upsertContact).toHaveBeenCalledTimes(1);
    expect(addNote).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("I have a question"),
      })
    );
    expect(sendConfirmation).toHaveBeenCalledTimes(1);
    expect(notifyMarketer).toHaveBeenCalledTimes(1);
  });

  it("returns 400 when message is empty", async () => {
    const res = await POST(makeRequest({ ...validPayload, message: "" }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "" }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 400 when consent is false", async () => {
    const res = await POST(makeRequest({ ...validPayload, consent: false }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });
});
