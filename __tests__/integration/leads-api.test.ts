/**
 * @jest-environment node
 *
 * Integration tests for the admin leads API.
 * Uses test lead: chibuzormekalam@gmail.com
 */

import { NextRequest } from "next/server";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("@/lib/db", () => ({
  db: {
    lead: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    student: {
      create: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

jest.mock("@/lib/email", () => ({
  sendConfirmation: jest.fn().mockResolvedValue(undefined),
}));

// ── Imports after mocks ──────────────────────────────────────────────────────

import { GET } from "@/app/api/cyvant-hq/leads/route";
import { GET as getLeadById, PATCH } from "@/app/api/cyvant-hq/leads/[id]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { sendConfirmation } from "@/lib/email";

beforeEach(() => {
  jest.resetAllMocks();
  (sendConfirmation as jest.Mock).mockResolvedValue(undefined);
});

// ── Fixtures ─────────────────────────────────────────────────────────────────

const SESSION = { user: { name: "Admin", email: "admin@cyvant.com", role: "admin" } };

const LEAD = {
  id: "lead-chibuzor",
  name: "Chibuzor Mekalam",
  email: "chibuzormekalam@gmail.com",
  phone: "+2348000000000",
  company: null,
  leadSource: "website",
  courseInterest: "Cyber Security Fundamentals",
  serviceInterest: null,
  qualifyingAnswer: "I want to switch into cybersecurity",
  message: null,
  photoUrl: null,
  leadScore: 0,
  status: "new",
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: { notes: 0 },
};

function makeReq(method: string, url: string, body?: object): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

// ── GET /api/cyvant-hq/leads ─────────────────────────────────────────────────────

describe("GET /api/cyvant-hq/leads", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await GET(makeReq("GET", "http://localhost/api/cyvant-hq/leads"));
    expect(res.status).toBe(401);
  });

  it("returns all leads including test lead", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.lead.findMany as jest.Mock).mockResolvedValueOnce([LEAD]);
    (db.lead.count as jest.Mock).mockResolvedValueOnce(1);

    const res = await GET(makeReq("GET", "http://localhost/api/cyvant-hq/leads"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.data).toHaveLength(1);
    expect(data.data[0].email).toBe("chibuzormekalam@gmail.com");
    expect(data.data[0].name).toBe("Chibuzor Mekalam");
  });

  it("filters by status=new", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.lead.findMany as jest.Mock).mockResolvedValueOnce([LEAD]);
    (db.lead.count as jest.Mock).mockResolvedValueOnce(1);

    const res = await GET(makeReq("GET", "http://localhost/api/cyvant-hq/leads?status=new"));
    expect(res.status).toBe(200);
    expect(db.lead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: "new" }),
      })
    );
  });

  it("filters by source=website", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.lead.findMany as jest.Mock).mockResolvedValueOnce([LEAD]);
    (db.lead.count as jest.Mock).mockResolvedValueOnce(1);

    const res = await GET(makeReq("GET", "http://localhost/api/cyvant-hq/leads?source=website"));
    expect(res.status).toBe(200);
    expect(db.lead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ leadSource: "website" }),
      })
    );
  });

  it("searches by query string matching name or email", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.lead.findMany as jest.Mock).mockResolvedValueOnce([LEAD]);
    (db.lead.count as jest.Mock).mockResolvedValueOnce(1);

    const res = await GET(makeReq("GET", "http://localhost/api/cyvant-hq/leads?q=chibuzor"));
    expect(res.status).toBe(200);
    expect(db.lead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ OR: expect.any(Array) }),
      })
    );
  });
});

// ── GET /api/cyvant-hq/leads/[id] ────────────────────────────────────────────────

describe("GET /api/cyvant-hq/leads/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await getLeadById(
      makeReq("GET", "http://localhost/api/cyvant-hq/leads/lead-chibuzor"),
      { params: Promise.resolve({ id: "lead-chibuzor" }) }
    );
    expect(res.status).toBe(401);
  });

  it("returns 404 when lead not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.lead.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const res = await getLeadById(
      makeReq("GET", "http://localhost/api/cyvant-hq/leads/nonexistent"),
      { params: Promise.resolve({ id: "nonexistent" }) }
    );
    expect(res.status).toBe(404);
  });

  it("returns the lead with notes when found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.lead.findUnique as jest.Mock).mockResolvedValueOnce({ ...LEAD, notes: [], student: null });

    const res = await getLeadById(
      makeReq("GET", "http://localhost/api/cyvant-hq/leads/lead-chibuzor"),
      { params: Promise.resolve({ id: "lead-chibuzor" }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.email).toBe("chibuzormekalam@gmail.com");
  });
});

// ── PATCH /api/cyvant-hq/leads/[id] ──────────────────────────────────────────────

describe("PATCH /api/cyvant-hq/leads/[id] — status update", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/cyvant-hq/leads/lead-chibuzor", { status: "contacted" }),
      { params: Promise.resolve({ id: "lead-chibuzor" }) }
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 for an invalid status value", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/cyvant-hq/leads/lead-chibuzor", { status: "deleted" }),
      { params: Promise.resolve({ id: "lead-chibuzor" }) }
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/invalid status/i);
  });

  it("updates status to contacted successfully", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    const updated = { ...LEAD, status: "contacted", student: null };
    (db.lead.update as jest.Mock).mockResolvedValueOnce(updated);

    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/cyvant-hq/leads/lead-chibuzor", { status: "contacted" }),
      { params: Promise.resolve({ id: "lead-chibuzor" }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe("contacted");
  });

  it("auto-creates a student record when status set to enrolled", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    const enrolled = { ...LEAD, status: "enrolled", student: null };
    (db.lead.update as jest.Mock).mockResolvedValueOnce(enrolled);
    (db.student.create as jest.Mock).mockResolvedValueOnce({
      id: "student-new",
      name: "Chibuzor Mekalam",
      email: "chibuzormekalam@gmail.com",
      courseName: "Cyber Security Fundamentals",
    });

    await PATCH(
      makeReq("PATCH", "http://localhost/api/cyvant-hq/leads/lead-chibuzor", { status: "enrolled" }),
      { params: Promise.resolve({ id: "lead-chibuzor" }) }
    );

    expect(db.student.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        leadId: "lead-chibuzor",
        name: "Chibuzor Mekalam",
        email: "chibuzormekalam@gmail.com",
        courseName: "Cyber Security Fundamentals",
      }),
    });
  });

  it("sends an enrollment confirmation email when enrolled", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    const enrolled = { ...LEAD, status: "enrolled", student: null };
    (db.lead.update as jest.Mock).mockResolvedValueOnce(enrolled);
    (db.student.create as jest.Mock).mockResolvedValueOnce({ id: "student-new" });

    await PATCH(
      makeReq("PATCH", "http://localhost/api/cyvant-hq/leads/lead-chibuzor", { status: "enrolled" }),
      { params: Promise.resolve({ id: "lead-chibuzor" }) }
    );

    // Give the fire-and-forget email call time to be registered
    await new Promise((r) => setTimeout(r, 10));
    expect(sendConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ to: "chibuzormekalam@gmail.com" })
    );
  });

  it("does not create a duplicate student if one already exists", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    const alreadyEnrolled = {
      ...LEAD,
      status: "enrolled",
      student: { id: "existing-student" },
    };
    (db.lead.update as jest.Mock).mockResolvedValueOnce(alreadyEnrolled);

    await PATCH(
      makeReq("PATCH", "http://localhost/api/cyvant-hq/leads/lead-chibuzor", { status: "enrolled" }),
      { params: Promise.resolve({ id: "lead-chibuzor" }) }
    );

    expect(db.student.create).not.toHaveBeenCalled();
  });
});
