/**
 * @jest-environment node
 *
 * Integration tests for the admin students API.
 * Uses test student: chibuzormekalam@gmail.com
 */

import { NextRequest } from "next/server";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("@/lib/db", () => ({
  db: {
    student: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
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

import { GET } from "@/app/api/admin/students/route";
import { GET as getStudentById, PATCH } from "@/app/api/admin/students/[id]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { sendConfirmation } from "@/lib/email";

beforeEach(() => {
  jest.resetAllMocks();
  (sendConfirmation as jest.Mock).mockResolvedValue(undefined);
});

// ── Fixtures ─────────────────────────────────────────────────────────────────

const SESSION = { user: { name: "Admin", email: "admin@cyvant.com", role: "admin" } };

const STUDENT = {
  id: "student-chibuzor",
  leadId: "lead-chibuzor",
  name: "Chibuzor Mekalam",
  email: "chibuzormekalam@gmail.com",
  phone: "+2348000000000",
  courseName: "Cyber Security Fundamentals",
  cohort: null,
  startDate: null,
  paymentStatus: "pending",
  amountPaid: 0,
  notes: null,
  enrolledAt: new Date(),
  updatedAt: new Date(),
  lead: { status: "enrolled", leadSource: "website" },
};

function makeReq(method: string, url: string, body?: object): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

// ── GET /api/admin/students ──────────────────────────────────────────────────

describe("GET /api/admin/students", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await GET(makeReq("GET", "http://localhost/api/admin/students"));
    expect(res.status).toBe(401);
  });

  it("returns all students including test student", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findMany as jest.Mock).mockResolvedValueOnce([STUDENT]);

    const res = await GET(makeReq("GET", "http://localhost/api/admin/students"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].email).toBe("chibuzormekalam@gmail.com");
    expect(data[0].courseName).toBe("Cyber Security Fundamentals");
  });

  it("filters students by paymentStatus", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findMany as jest.Mock).mockResolvedValueOnce([STUDENT]);

    const res = await GET(
      makeReq("GET", "http://localhost/api/admin/students?paymentStatus=pending")
    );
    expect(res.status).toBe(200);
    expect(db.student.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ paymentStatus: "pending" }),
      })
    );
  });

  it("searches by query string", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findMany as jest.Mock).mockResolvedValueOnce([STUDENT]);

    const res = await GET(makeReq("GET", "http://localhost/api/admin/students?q=chibuzor"));
    expect(res.status).toBe(200);
    expect(db.student.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ OR: expect.any(Array) }),
      })
    );
  });

  it("returns empty array when no students match", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findMany as jest.Mock).mockResolvedValueOnce([]);

    const res = await GET(makeReq("GET", "http://localhost/api/admin/students?q=nobody"));
    const data = await res.json();
    expect(data).toEqual([]);
  });
});

// ── GET /api/admin/students/[id] ─────────────────────────────────────────────

describe("GET /api/admin/students/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await getStudentById(
      makeReq("GET", "http://localhost/api/admin/students/student-chibuzor"),
      { params: Promise.resolve({ id: "student-chibuzor" }) }
    );
    expect(res.status).toBe(401);
  });

  it("returns 404 when student not found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const res = await getStudentById(
      makeReq("GET", "http://localhost/api/admin/students/nonexistent"),
      { params: Promise.resolve({ id: "nonexistent" }) }
    );
    expect(res.status).toBe(404);
  });

  it("returns student data when found", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce({
      ...STUDENT,
      lead: { status: "enrolled", leadSource: "website", notes: [] },
    });

    const res = await getStudentById(
      makeReq("GET", "http://localhost/api/admin/students/student-chibuzor"),
      { params: Promise.resolve({ id: "student-chibuzor" }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.email).toBe("chibuzormekalam@gmail.com");
  });
});

// ── PATCH /api/admin/students/[id] ───────────────────────────────────────────

describe("PATCH /api/admin/students/[id] — update record", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/students/student-chibuzor", {
        paymentStatus: "paid",
      }),
      { params: Promise.resolve({ id: "student-chibuzor" }) }
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 for an invalid paymentStatus", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce({ paymentStatus: "pending" });

    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/students/student-chibuzor", {
        paymentStatus: "overdue",
      }),
      { params: Promise.resolve({ id: "student-chibuzor" }) }
    );
    expect(res.status).toBe(400);
  });

  it("updates cohort and notes", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce({ paymentStatus: "pending" });
    const updated = { ...STUDENT, cohort: "Jan 2026", notes: "Joining from Port Harcourt" };
    (db.student.update as jest.Mock).mockResolvedValueOnce(updated);

    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/students/student-chibuzor", {
        cohort: "Jan 2026",
        notes: "Joining from Port Harcourt",
      }),
      { params: Promise.resolve({ id: "student-chibuzor" }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.cohort).toBe("Jan 2026");
  });

  it("marks payment as paid and returns updated student", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce({ paymentStatus: "partial" });
    const paid = { ...STUDENT, paymentStatus: "paid", amountPaid: 200000 };
    (db.student.update as jest.Mock).mockResolvedValueOnce(paid);

    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/students/student-chibuzor", {
        paymentStatus: "paid",
        amountPaid: 200000,
      }),
      { params: Promise.resolve({ id: "student-chibuzor" }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.paymentStatus).toBe("paid");
    expect(data.amountPaid).toBe(200000);
  });

  it("sends payment confirmation email when status transitions to paid", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce({ paymentStatus: "pending" });
    const paid = { ...STUDENT, paymentStatus: "paid", amountPaid: 200000 };
    (db.student.update as jest.Mock).mockResolvedValueOnce(paid);

    await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/students/student-chibuzor", {
        paymentStatus: "paid",
        amountPaid: 200000,
      }),
      { params: Promise.resolve({ id: "student-chibuzor" }) }
    );

    await new Promise((r) => setTimeout(r, 10));
    expect(sendConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ to: "chibuzormekalam@gmail.com" })
    );
  });

  it("does not resend payment email if already paid", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce({ paymentStatus: "paid" });
    const paid = { ...STUDENT, paymentStatus: "paid", amountPaid: 200000 };
    (db.student.update as jest.Mock).mockResolvedValueOnce(paid);

    await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/students/student-chibuzor", {
        paymentStatus: "paid",
        amountPaid: 200000,
      }),
      { params: Promise.resolve({ id: "student-chibuzor" }) }
    );

    await new Promise((r) => setTimeout(r, 10));
    expect(sendConfirmation).not.toHaveBeenCalled();
  });
});
