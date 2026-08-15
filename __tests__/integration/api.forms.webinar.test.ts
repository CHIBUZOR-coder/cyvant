/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/webinar/route";
import { NextRequest } from "next/server";

// Mock external services — never hit real APIs in integration tests
jest.mock("@/lib/hubspot", () => ({
  upsertContact: jest.fn().mockResolvedValue({ id: "hs-123" }),
  addNote: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue({}),
  notifyMarketer: jest.fn().mockResolvedValue({}),
}));

import { upsertContact, addNote } from "@/lib/hubspot";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/forms/webinar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Ada Obi",
  email: "ada@example.com",
  phone: "+2348012345678",
  qualifyingAnswer: "I want a career in cybersecurity",
  consent: true,
};

describe("POST /api/forms/webinar", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 200 and calls HubSpot + email for a valid submission", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    expect(upsertContact).toHaveBeenCalledTimes(1);
    expect(upsertContact).toHaveBeenCalledWith(
      expect.objectContaining({ email: "ada@example.com", firstname: "Ada Obi" }),
      1
    );
    expect(addNote).toHaveBeenCalledTimes(1);
    expect(sendConfirmation).toHaveBeenCalledTimes(1);
    expect(notifyMarketer).toHaveBeenCalledTimes(1);
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ ...validPayload, name: "" }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 400 when consent is false", async () => {
    const res = await POST(makeRequest({ ...validPayload, consent: false }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 400 when qualifying answer is missing", async () => {
    const res = await POST(makeRequest({ ...validPayload, qualifyingAnswer: "" }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("does not create a CRM record when submission is invalid", async () => {
    await POST(makeRequest({ name: "", email: "", consent: false }));
    expect(upsertContact).not.toHaveBeenCalled();
  });
});
