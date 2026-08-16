/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/course-inquiry/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/leads", () => ({
  upsertLead: jest.fn().mockResolvedValue({ id: "lead-1" }),
  addLeadNote: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue({}),
  notifyMarketer: jest.fn().mockResolvedValue({}),
}));

import { upsertLead, addLeadNote } from "@/lib/leads";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/forms/course-inquiry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Emeka Jones",
  email: "emeka@example.com",
  phone: "+2348099887766",
  courseInterest: "Cybersecurity Foundations",
  consent: true,
};

describe("POST /api/forms/course-inquiry", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 200 and creates a Prisma lead tagged with course interest", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    expect(upsertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "emeka@example.com",
        name: "Emeka Jones",
        leadSource: "course_inquiry",
        courseInterest: "Cybersecurity Foundations",
      }),
      2
    );
  });

  it("logs a note with the course interest", async () => {
    await POST(makeRequest(validPayload));
    expect(addLeadNote).toHaveBeenCalledWith(
      "lead-1",
      expect.stringContaining("Cybersecurity Foundations")
    );
  });

  it("returns 400 for missing required fields", async () => {
    const res = await POST(makeRequest({ name: "", email: "", consent: false }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "bad" }));
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
