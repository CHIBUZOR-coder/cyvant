/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/webinar/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/leads", () => ({
  upsertLead: jest.fn().mockResolvedValue({ id: "lead-4" }),
  addLeadNote: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue({}),
  notifyMarketer: jest.fn().mockResolvedValue({}),
}));

import { upsertLead, addLeadNote } from "@/lib/leads";

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

  it("returns 200 and creates a Prisma lead for a valid submission", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    expect(upsertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "ada@example.com",
        name: "Ada Obi",
        leadSource: "webinar_registration",
        qualifyingAnswer: "I want a career in cybersecurity",
      }),
      1
    );
  });

  it("logs a note with the qualifying answer", async () => {
    await POST(makeRequest(validPayload));
    expect(addLeadNote).toHaveBeenCalledWith(
      "lead-4",
      expect.stringContaining("I want a career in cybersecurity")
    );
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ ...validPayload, name: "" }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 400 when email is invalid", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 400 when consent is false", async () => {
    const res = await POST(makeRequest({ ...validPayload, consent: false }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 400 when qualifying answer is missing", async () => {
    const res = await POST(makeRequest({ ...validPayload, qualifyingAnswer: "" }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 500 when lead creation fails", async () => {
    (upsertLead as jest.Mock).mockRejectedValueOnce(new Error("DB error"));
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(500);
  });
});
