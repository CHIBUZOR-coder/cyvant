/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/discovery-call/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/leads", () => ({
  upsertLead: jest.fn().mockResolvedValue({ id: "lead-2" }),
  addLeadNote: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue({}),
  notifyMarketer: jest.fn().mockResolvedValue({}),
}));

import { upsertLead, addLeadNote } from "@/lib/leads";

function makeRequest(body: object) {
  return new NextRequest("http://localhost/api/forms/discovery-call", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

const validPayload = {
  name: "Amaka Obi",
  email: "amaka@example.com",
  phone: "+2348011223344",
  consent: true,
};

describe("POST /api/forms/discovery-call", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns 200 and creates a Prisma lead with discovery_call source", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);

    expect(upsertLead).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "amaka@example.com",
        name: "Amaka Obi",
        leadSource: "discovery_call",
      }),
      3
    );
  });

  it("logs a discovery call note", async () => {
    await POST(makeRequest(validPayload));
    expect(addLeadNote).toHaveBeenCalledWith(
      "lead-2",
      expect.stringContaining("Discovery call")
    );
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(makeRequest({ name: "", email: "", consent: false }));
    expect(res.status).toBe(400);
    expect(upsertLead).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "not-an-email" }));
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
