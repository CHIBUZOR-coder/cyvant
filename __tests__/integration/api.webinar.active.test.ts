/**
 * @jest-environment node
 */
import { GET } from "@/app/api/webinar/active/route";
import { NextRequest } from "next/server";

jest.mock("@/lib/db", () => ({
  db: {
    webinar: {
      findFirst: jest.fn(),
    },
  },
}));

import { db } from "@/lib/db";

function makeRequest() {
  return new NextRequest("http://localhost/api/webinar/active");
}

describe("GET /api/webinar/active", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when no upcoming webinar found", async () => {
    (db.webinar.findFirst as jest.Mock).mockResolvedValue(null);
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.webinar).toBeNull();
  });

  it("returns the active upcoming webinar from the database", async () => {
    const webinar = {
      id: "w3",
      title: "Intro to Cybersecurity",
      date: new Date(Date.now() + 86400000),
      time: "6:00 PM WAT",
      registrationOpen: true,
    };
    (db.webinar.findFirst as jest.Mock).mockResolvedValue(webinar);
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.webinar).toMatchObject({ id: "w3", title: "Intro to Cybersecurity" });
  });

  it("returns null when db throws (graceful error handling)", async () => {
    (db.webinar.findFirst as jest.Mock).mockRejectedValue(new Error("DB connection error"));
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.webinar).toBeNull();
  });
});
