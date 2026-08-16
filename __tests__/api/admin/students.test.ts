/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("@/lib/db", () => ({
  db: {
    student: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { GET } from "@/app/api/admin/students/route";
import { GET as GET_ID, PATCH } from "@/app/api/admin/students/[id]/route";

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

// ─── GET /api/admin/students ──────────────────────────────────────────────

describe("GET /api/admin/students", () => {
  it("returns 401 when not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await GET(makeReq("http://localhost/api/admin/students"));
    expect(res.status).toBe(401);
  });

  it("returns students list", async () => {
    const students = [{ id: "s1", name: "Test Student", paymentStatus: "pending" }];
    (db.student.findMany as jest.Mock).mockResolvedValue(students);

    const res = await GET(makeReq("http://localhost/api/admin/students"));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual(students);
  });

  it("filters by paymentStatus", async () => {
    (db.student.findMany as jest.Mock).mockResolvedValue([]);
    await GET(makeReq("http://localhost/api/admin/students?paymentStatus=paid"));
    expect(db.student.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ paymentStatus: "paid" }) })
    );
  });

  it("filters by search query", async () => {
    (db.student.findMany as jest.Mock).mockResolvedValue([]);
    await GET(makeReq("http://localhost/api/admin/students?q=jane"));
    expect(db.student.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ OR: expect.any(Array) }) })
    );
  });
});

// ─── GET /api/admin/students/[id] ────────────────────────────────────────

describe("GET /api/admin/students/[id]", () => {
  it("returns 404 for unknown student", async () => {
    (db.student.findUnique as jest.Mock).mockResolvedValue(null);
    const res = await GET_ID(makeReq("http://localhost/api/admin/students/s1"), {
      params: Promise.resolve({ id: "s1" }),
    });
    expect(res.status).toBe(404);
  });

  it("returns student with lead data", async () => {
    const student = {
      id: "s1",
      name: "Jane Doe",
      paymentStatus: "pending",
      lead: { id: "l1", notes: [] },
    };
    (db.student.findUnique as jest.Mock).mockResolvedValue(student);
    const res = await GET_ID(makeReq("http://localhost/api/admin/students/s1"), {
      params: Promise.resolve({ id: "s1" }),
    });
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.name).toBe("Jane Doe");
  });
});

// ─── PATCH /api/admin/students/[id] ──────────────────────────────────────

describe("PATCH /api/admin/students/[id]", () => {
  it("returns 400 for invalid paymentStatus", async () => {
    const res = await PATCH(
      makeReq("http://localhost/api/admin/students/s1", "PATCH", { paymentStatus: "free" }),
      { params: Promise.resolve({ id: "s1" }) }
    );
    expect(res.status).toBe(400);
  });

  it("updates payment status to partial", async () => {
    const updated = { id: "s1", paymentStatus: "partial", amountPaid: 50000 };
    (db.student.update as jest.Mock).mockResolvedValue(updated);

    const res = await PATCH(
      makeReq("http://localhost/api/admin/students/s1", "PATCH", { paymentStatus: "partial", amountPaid: 50000 }),
      { params: Promise.resolve({ id: "s1" }) }
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.paymentStatus).toBe("partial");
    expect(data.amountPaid).toBe(50000);
  });

  it("updates payment status to paid", async () => {
    const updated = { id: "s1", paymentStatus: "paid", amountPaid: 150000 };
    (db.student.update as jest.Mock).mockResolvedValue(updated);

    const res = await PATCH(
      makeReq("http://localhost/api/admin/students/s1", "PATCH", { paymentStatus: "paid", amountPaid: 150000 }),
      { params: Promise.resolve({ id: "s1" }) }
    );
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.paymentStatus).toBe("paid");
  });

  it("updates cohort and startDate", async () => {
    const updated = { id: "s1", cohort: "Q3 2025", startDate: "2025-09-01T00:00:00.000Z" };
    (db.student.update as jest.Mock).mockResolvedValue(updated);

    const res = await PATCH(
      makeReq("http://localhost/api/admin/students/s1", "PATCH", { cohort: "Q3 2025", startDate: "2025-09-01" }),
      { params: Promise.resolve({ id: "s1" }) }
    );
    expect(res.status).toBe(200);
    expect(db.student.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ cohort: "Q3 2025" }) })
    );
  });
});
