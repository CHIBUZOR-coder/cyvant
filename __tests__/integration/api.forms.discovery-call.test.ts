/**
 * @jest-environment node
 */
import { POST } from "@/app/api/forms/discovery-call/route";
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
import { sendConfirmation, notifyMarketer } from "@/lib/email";

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

  it("returns 200 and creates a CRM record with IN_PROGRESS status", async () => {
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(200);

    expect(upsertContact).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "amaka@example.com",
        hs_lead_status: "IN_PROGRESS",
      }),
      3
    );
    expect(addNote).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("Discovery call request"),
      })
    );
    expect(sendConfirmation).toHaveBeenCalledTimes(1);
    expect(notifyMarketer).toHaveBeenCalledTimes(1);
  });

  it("sends confirmation to the lead's email", async () => {
    await POST(makeRequest(validPayload));
    expect(sendConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ to: "amaka@example.com", name: "Amaka Obi" })
    );
  });

  it("notifies the marketer with the lead's name and contact info", async () => {
    await POST(makeRequest(validPayload));
    expect(notifyMarketer).toHaveBeenCalledWith(
      expect.stringContaining("Amaka Obi"),
      expect.stringContaining("amaka@example.com")
    );
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await POST(makeRequest({ name: "", email: "", consent: false }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email", async () => {
    const res = await POST(makeRequest({ ...validPayload, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 400 when consent is false", async () => {
    const res = await POST(makeRequest({ ...validPayload, consent: false }));
    expect(res.status).toBe(400);
    expect(upsertContact).not.toHaveBeenCalled();
  });

  it("returns 500 when HubSpot throws", async () => {
    (upsertContact as jest.Mock).mockRejectedValueOnce(new Error("HubSpot down"));
    const res = await POST(makeRequest(validPayload));
    expect(res.status).toBe(500);
  });
});
