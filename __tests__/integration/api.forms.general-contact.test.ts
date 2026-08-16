/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/general-contact/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/leads", () => ({
  upsertLead: jest.fn().mockResolvedValue({ id: "lead-5" }),
  addLeadNote: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue({}),
  notifyMarketer: jest.fn().mockResolvedValue({}),
}));

import { upsertLead, addLeadNote } from "@/lib/leads";

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

  it("returns 200 and creates a Prisma lead for a valid submission", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    expect(upsertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "chidi@example.com",
        name: "Chidi Okoro",
        leadSource: "general_contact",
        message: "I have a question about your programs.",
      })
    );
  });

  it("logs the message as a note", async () => {
    await POST(makeRequest(validPayload));
    expect(addLeadNote).toHaveBeenCalledWith(
      "lead-5",
      expect.stringContaining("I have a question")
    );
  });

  it("returns 400 when message is empty", async () => {
    const res = await POST(makeRequest({ ...validPayload, message: "" }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 400 when email is missing", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "" }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 400 when consent is false", async () => {
    const res = await POST(makeRequest({ ...validPayload, consent: false }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 500 when lead creation fails", async () => {
    (upsertLead as jest.Mock).mockRejectedValueOnce(new Error("DB error"));
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(500);
  });
});
