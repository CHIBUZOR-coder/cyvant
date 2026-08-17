/**
 * @jest-environment node
 *
 * End-to-end flow tests — no browser, no real DB.
 * These tests call real route handlers in sequence to verify the complete
 * business flow from lead creation through enrolment and payment confirmation.
 *
 * Test student: chibuzormekalam@gmail.com
 */

import { NextRequest } from "next/server";

// ── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("@/lib/db", () => ({
  db: {
    lead: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    student: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    course: {
      findMany: jest.fn(),
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

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// ── Imports ──────────────────────────────────────────────────────────────────

import { GET as getLeads } from "@/app/api/admin/leads/route";
import { PATCH as patchLead } from "@/app/api/admin/leads/[id]/route";
import { GET as getStudents } from "@/app/api/admin/students/route";
import { PATCH as patchStudent } from "@/app/api/admin/students/[id]/route";
import { GET as getCourses } from "@/app/api/admin/courses/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { sendConfirmation } from "@/lib/email";

// ── Shared state ─────────────────────────────────────────────────────────────

const SESSION = { user: { name: "Admin", email: "admin@cyvant.com", role: "admin" } };

const LEAD_ID = "lead-chibuzor-e2e";
const STUDENT_ID = "student-chibuzor-e2e";

const LEAD = {
  id: LEAD_ID,
  name: "Chibuzor Mekalam",
  email: "chibuzormekalam@gmail.com",
  phone: "+2348000000000",
  company: null,
  leadSource: "webinar",
  courseInterest: "Cyber Security Fundamentals",
  serviceInterest: null,
  qualifyingAnswer: "I want to break into cybersecurity professionally",
  message: null,
  photoUrl: null,
  leadScore: 60,
  status: "new",
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: { notes: 2 },
};

const STUDENT = {
  id: STUDENT_ID,
  leadId: LEAD_ID,
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
  lead: { status: "enrolled", leadSource: "webinar" },
};

function req(method: string, url: string, body?: object): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

function mockSession() {
  (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
}

// ── Flow 1: Lead discovery → contacted → enrolled ────────────────────────────

describe("Flow: lead marked enrolled → student auto-created → email sent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("step 1 — admin sees lead in the leads list", async () => {
    mockSession();
    (db.lead.findMany as jest.Mock).mockResolvedValueOnce([LEAD]);

    const res = await getLeads(req("GET", "http://localhost/api/admin/leads"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data[0].email).toBe("chibuzormekalam@gmail.com");
    expect(data[0].status).toBe("new");
  });

  it("step 2 — admin contacts the lead (status → contacted)", async () => {
    mockSession();
    const contacted = { ...LEAD, status: "contacted", student: null };
    (db.lead.update as jest.Mock).mockResolvedValueOnce(contacted);

    const res = await patchLead(
      req("PATCH", `http://localhost/api/admin/leads/${LEAD_ID}`, { status: "contacted" }),
      { params: Promise.resolve({ id: LEAD_ID }) }
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.status).toBe("contacted");
    expect(db.student.create).not.toHaveBeenCalled();
  });

  it("step 3 — lead agrees to enrol (status → enrolled, student created)", async () => {
    mockSession();
    const enrolled = { ...LEAD, status: "enrolled", student: null };
    (db.lead.update as jest.Mock).mockResolvedValueOnce(enrolled);
    (db.student.create as jest.Mock).mockResolvedValueOnce(STUDENT);

    const res = await patchLead(
      req("PATCH", `http://localhost/api/admin/leads/${LEAD_ID}`, { status: "enrolled" }),
      { params: Promise.resolve({ id: LEAD_ID }) }
    );
    expect(res.status).toBe(200);

    expect(db.student.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        leadId: LEAD_ID,
        name: "Chibuzor Mekalam",
        email: "chibuzormekalam@gmail.com",
        courseName: "Cyber Security Fundamentals",
      }),
    });

    await new Promise((r) => setTimeout(r, 10));
    expect(sendConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "chibuzormekalam@gmail.com",
        subject: expect.stringContaining("Enrolled"),
      })
    );
  });

  it("step 4 — student appears in student list", async () => {
    mockSession();
    (db.student.findMany as jest.Mock).mockResolvedValueOnce([STUDENT]);

    const res = await getStudents(req("GET", "http://localhost/api/admin/students"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data[0].email).toBe("chibuzormekalam@gmail.com");
    expect(data[0].paymentStatus).toBe("pending");
  });
});

// ── Flow 2: Student payment lifecycle ────────────────────────────────────────

describe("Flow: student payment — pending → partial → paid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("step 1 — admin records partial payment", async () => {
    mockSession();
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce({ paymentStatus: "pending" });
    const partial = { ...STUDENT, paymentStatus: "partial", amountPaid: 100000 };
    (db.student.update as jest.Mock).mockResolvedValueOnce(partial);

    const res = await patchStudent(
      req("PATCH", `http://localhost/api/admin/students/${STUDENT_ID}`, {
        paymentStatus: "partial",
        amountPaid: 100000,
      }),
      { params: Promise.resolve({ id: STUDENT_ID }) }
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.paymentStatus).toBe("partial");
    expect(data.amountPaid).toBe(100000);
    await new Promise((r) => setTimeout(r, 10));
    expect(sendConfirmation).not.toHaveBeenCalled();
  });

  it("step 2 — admin marks payment as fully paid", async () => {
    mockSession();
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce({ paymentStatus: "partial" });
    const paid = { ...STUDENT, paymentStatus: "paid", amountPaid: 200000 };
    (db.student.update as jest.Mock).mockResolvedValueOnce(paid);

    const res = await patchStudent(
      req("PATCH", `http://localhost/api/admin/students/${STUDENT_ID}`, {
        paymentStatus: "paid",
        amountPaid: 200000,
      }),
      { params: Promise.resolve({ id: STUDENT_ID }) }
    );
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.paymentStatus).toBe("paid");

    await new Promise((r) => setTimeout(r, 10));
    expect(sendConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "chibuzormekalam@gmail.com",
        subject: expect.stringContaining("Payment"),
      })
    );
  });

  it("step 3 — re-saving paid status does NOT re-send the email", async () => {
    mockSession();
    (db.student.findUnique as jest.Mock).mockResolvedValueOnce({ paymentStatus: "paid" });
    const paid = { ...STUDENT, paymentStatus: "paid", amountPaid: 200000 };
    (db.student.update as jest.Mock).mockResolvedValueOnce(paid);

    await patchStudent(
      req("PATCH", `http://localhost/api/admin/students/${STUDENT_ID}`, {
        paymentStatus: "paid",
      }),
      { params: Promise.resolve({ id: STUDENT_ID }) }
    );

    await new Promise((r) => setTimeout(r, 10));
    expect(sendConfirmation).not.toHaveBeenCalled();
  });
});

// ── Flow 3: Course catalog is accessible ─────────────────────────────────────

describe("Flow: admin views course catalog", () => {
  it("returns the published course list", async () => {
    mockSession();
    (db.course.findMany as jest.Mock).mockResolvedValueOnce([
      {
        id: "course-1",
        slug: "cyber-security-fundamentals",
        title: "Cyber Security Fundamentals",
        academy: "cybersecurity",
        tier: 1,
        path: null,
        level: "Beginner",
        duration: "6 Weeks",
        format: "Online, cohort-based",
        startingPrice: 200000,
        isStartHere: true,
        isMostPopular: false,
        featured: false,
        published: true,
        description: null,
        prerequisites: [],
        whatYouLearn: [],
        capstone: null,
        advancedElective: null,
        certificationAlignment: [],
        careerPaths: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const res = await getCourses(req("GET", "http://localhost/api/admin/courses"));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data[0].title).toBe("Cyber Security Fundamentals");
    expect(data[0].tier).toBe(1);
    expect(data[0].isStartHere).toBe(true);
  });
});
