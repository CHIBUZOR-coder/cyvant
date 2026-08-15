/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/course-inquiry/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/hubspot", () => ({
  upsertContact: jest.fn().mockResolvedValue({ id: "hs-456" }),
  addNote: jest.fn().mockResolvedValue({}),
}));
jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue({}),
  notifyMarketer: jest.fn().mockResolvedValue({}),
}));

import { upsertContact, addNote } from "@/lib/hubspot";
import { sendConfirmation, notifyMarketer } from "@/lib/email";

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

  it("returns 200 and creates a CRM record tagged with course interest", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);

    expect(upsertContact).toHaveBeenCalledWith(
      expect.objectContaining({ email: "emeka@example.com" }),
      2
    );
    expect(addNote).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("Cybersecurity Foundations"),
      })
    );
    expect(sendConfirmation).toHaveBeenCalledTimes(1);
    expect(notifyMarketer).toHaveBeenCalledTimes(1);
  });

  it("returns 400 for missing required fields", async () => {
    const res = await POST(makeRequest({ name: "", email: "", consent: false }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "bad" }));
    expect(res.status).toBe(400);
  });

  it("does not create a CRM record on invalid submission", async () => {
    await POST(makeRequest({ ...validPayload, consent: false }));
    expect(upsertContact).not.toHaveBeenCalled();
  });
});
