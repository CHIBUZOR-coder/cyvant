/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

// Mock next-auth before importing route
jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/db", () => ({
  db: {
    lead: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    student: {
      create: jest.fn(),
    },
    note: {
      create: jest.fn(),
    },
  },
}));

import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { GET } from "@/app/api/admin/leads/route";
import { GET as GET_ID, PATCH } from "@/app/api/admin/leads/[id]/route";
import { POST as POST_NOTE } from "@/app/api/admin/leads/[id]/notes/route";

const mockSession = { user: { name: "Admin", email: "admin@cyvant.com", role: "admin" } };

function makeReq(url: string, method = "GET", body?: unknown): NextRequest {
  return new NextRequest(url, {
    method,
    ...(body ? { body: JSON.stringify(body), headers: { "Content-Type": "application/json" } } : {}),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  (getServerSession as jest.Mock).mockResolvedValue(mockSession);
});

// ─── GET /api/admin/leads ─────────────────────────────────────────────────

describe("GET /api/admin/leads", () => {
  it("returns 401 when not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await GET(makeReq("http://localhost/api/admin/leads"));
    expect(res.status).toBe(401);
  });

  it("returns leads list when authenticated", async () => {
    const leads = [{ id: "1", name: "Test Lead" }];
    (db.lead.findMany as jest.Mock).mockResolvedValue(leads);

    const res = await GET(makeReq("http://localhost/api/admin/leads"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toEqual(leads);
  });

  it("passes search params to db query", async () => {
    (db.lead.findMany as jest.Mock).mockResolvedValue([]);
    await GET(makeReq("http://localhost/api/admin/leads?status=enrolled&q=john"));
    expect(db.lead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ status: "enrolled" }) })
    );
  });
});

// ─── GET /api/admin/leads/[id] ───────────────────────────────────────────

describe("GET /api/admin/leads/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await GET_ID(makeReq("http://localhost/api/admin/leads/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(res.status).toBe(401);
  });

  it("returns 404 for unknown lead", async () => {
    (db.lead.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await GET_ID(makeReq("http://localhost/api/admin/leads/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns lead data", async () => {
    const lead = { id: "abc", name: "John Doe", notes: [], student: null };
    (db.lead.findUnique as jest.Mock).mockResolvedValue(lead);
    const res = await GET_ID(makeReq("http://localhost/api/admin/leads/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.name).toBe("John Doe");
  });
});

// ─── PATCH /api/admin/leads/[id] ────────────────────────────────────────

describe("PATCH /api/admin/leads/[id]", () => {
  it("returns 400 for invalid status", async () => {
    const res = await PATCH(makeReq("http://localhost/api/admin/leads/abc", "PATCH", { status: "invalid" }), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(res.status).toBe(400);
  });

  it("updates lead status", async () => {
    const updatedLead = { id: "abc", status: "contacted", student: null };
    (db.lead.update as jest.Mock).mockResolvedValue(updatedLead);

    const res = await PATCH(makeReq("http://localhost/api/admin/leads/abc", "PATCH", { status: "contacted" }), {
      params: Promise.resolve({ id: "abc" }),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("contacted");
  });

  it("auto-creates student when status is enrolled and no student exists", async () => {
    const lead = {
      id: "abc",
      name: "Jane Doe",
      email: "jane@test.com",
      phone: null,
      courseInterest: "Cybersecurity",
      status: "enrolled",
      student: null,
    };
    (db.lead.update as jest.Mock).mockResolvedValue(lead);
    (db.student.create as jest.Mock).mockResolvedValue({ id: "stu-1" });

    await PATCH(makeReq("http://localhost/api/admin/leads/abc", "PATCH", { status: "enrolled" }), {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(db.student.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ leadId: "abc", name: "Jane Doe", email: "jane@test.com" }),
      })
    );
  });

  it("does not create student if one already exists", async () => {
    const lead = { id: "abc", name: "Jane", email: "jane@test.com", student: { id: "stu-1" } };
    (db.lead.update as jest.Mock).mockResolvedValue(lead);

    await PATCH(makeReq("http://localhost/api/admin/leads/abc", "PATCH", { status: "enrolled" }), {
      params: Promise.resolve({ id: "abc" }),
    });

    expect(db.student.create).not.toHaveBeenCalled();
  });
});

// ─── POST /api/admin/leads/[id]/notes ────────────────────────────────────

describe("POST /api/admin/leads/[id]/notes", () => {
  it("returns 400 when content is empty", async () => {
    const res = await POST_NOTE(makeReq("http://localhost/api/admin/leads/abc/notes", "POST", { content: "  " }), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(res.status).toBe(400);
  });

  it("creates a note and returns 201", async () => {
    const note = { id: "n1", content: "Called lead", type: "call", createdAt: new Date().toISOString() };
    (db.note.create as jest.Mock).mockResolvedValue(note);

    const res = await POST_NOTE(
      makeReq("http://localhost/api/admin/leads/abc/notes", "POST", { content: "Called lead", type: "call" }),
      { params: Promise.resolve({ id: "abc" }) }
    );
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.content).toBe("Called lead");
    expect(db.note.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ leadId: "abc", type: "call" }) })
    );
  });
});
