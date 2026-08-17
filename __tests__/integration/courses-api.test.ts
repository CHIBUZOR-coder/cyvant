/**
 * @jest-environment node
 *
 * Integration tests for the admin courses API.
 * All DB calls and auth are mocked — this tests route logic, validation, and
 * response shapes without hitting a real database.
 */

import { NextRequest } from "next/server";

// ── Mocks (must come before imports that use them) ──────────────────────────

jest.mock("@/lib/db", () => ({
  db: {
    course: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

// ── Imports after mocks ──────────────────────────────────────────────────────

import { GET, POST } from "@/app/api/admin/courses/route";
import { PATCH, DELETE } from "@/app/api/admin/courses/[id]/route";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

// ── Helpers ──────────────────────────────────────────────────────────────────

const SESSION = { user: { name: "Admin", email: "admin@cyvant.com", role: "admin" } };

const COURSE_ROW = {
  id: "course-abc",
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
  description: "The entry-level course.",
  prerequisites: [],
  whatYouLearn: ["CIA Triad", "Network Basics"],
  capstone: null,
  advancedElective: null,
  certificationAlignment: ["CompTIA Security+"],
  careerPaths: ["SOC Analyst"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

function makeReq(method: string, url: string, body?: object): NextRequest {
  return new NextRequest(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

// ── GET /api/admin/courses ───────────────────────────────────────────────────

describe("GET /api/admin/courses", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await GET(makeReq("GET", "http://localhost/api/admin/courses"));
    expect(res.status).toBe(401);
  });

  it("returns mapped courses when authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.course.findMany as jest.Mock).mockResolvedValueOnce([COURSE_ROW]);

    const res = await GET(makeReq("GET", "http://localhost/api/admin/courses"));
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveLength(1);
    expect(data[0].title).toBe("Cyber Security Fundamentals");
    expect(data[0].tier).toBe(1);
  });

  it("returns an empty array when no courses exist", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.course.findMany as jest.Mock).mockResolvedValueOnce([]);

    const res = await GET(makeReq("GET", "http://localhost/api/admin/courses"));
    const data = await res.json();
    expect(data).toEqual([]);
  });
});

// ── POST /api/admin/courses ──────────────────────────────────────────────────

describe("POST /api/admin/courses", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await POST(
      makeReq("POST", "http://localhost/api/admin/courses", {
        title: "Test", tier: 1, level: "Beginner", duration: "4 Weeks",
      })
    );
    expect(res.status).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    const res = await POST(
      makeReq("POST", "http://localhost/api/admin/courses", { title: "Test only" })
    );
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toMatch(/required/i);
  });

  it("creates a course with auto-generated slug and returns 201", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.course.create as jest.Mock).mockResolvedValueOnce(COURSE_ROW);

    const res = await POST(
      makeReq("POST", "http://localhost/api/admin/courses", {
        title: "Cyber Security Fundamentals",
        tier: 1,
        level: "Beginner",
        duration: "6 Weeks",
        startingPrice: 200000,
        whatYouLearn: ["CIA Triad", "Network Basics"],
      })
    );
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe("Cyber Security Fundamentals");
    expect(data.slug).toBe("cyber-security-fundamentals");
  });

  it("passes whatYouLearn array to db.course.create", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.course.create as jest.Mock).mockResolvedValueOnce(COURSE_ROW);

    await POST(
      makeReq("POST", "http://localhost/api/admin/courses", {
        title: "Test Course",
        tier: 1,
        level: "Beginner",
        duration: "6 Weeks",
        whatYouLearn: ["CIA Triad", "Network Basics"],
      })
    );
    expect(db.course.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          whatYouLearn: ["CIA Triad", "Network Basics"],
        }),
      })
    );
  });
});

// ── PATCH /api/admin/courses/[id] ────────────────────────────────────────────

describe("PATCH /api/admin/courses/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/courses/course-abc", { title: "New" }),
      { params: Promise.resolve({ id: "course-abc" }) }
    );
    expect(res.status).toBe(401);
  });

  it("updates and returns the patched course", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    const updated = { ...COURSE_ROW, title: "Updated Title" };
    (db.course.update as jest.Mock).mockResolvedValueOnce(updated);

    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/courses/course-abc", {
        title: "Updated Title",
      }),
      { params: Promise.resolve({ id: "course-abc" }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe("Updated Title");
  });

  it("coerces tier to number before saving", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.course.update as jest.Mock).mockResolvedValueOnce(COURSE_ROW);

    await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/courses/course-abc", { tier: "2" }),
      { params: Promise.resolve({ id: "course-abc" }) }
    );
    expect(db.course.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tier: 2 }),
      })
    );
  });

  it("converts empty path string to null", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.course.update as jest.Mock).mockResolvedValueOnce(COURSE_ROW);

    await PATCH(
      makeReq("PATCH", "http://localhost/api/admin/courses/course-abc", { path: "" }),
      { params: Promise.resolve({ id: "course-abc" }) }
    );
    expect(db.course.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ path: null }),
      })
    );
  });
});

// ── DELETE /api/admin/courses/[id] ───────────────────────────────────────────

describe("DELETE /api/admin/courses/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(null);
    const res = await DELETE(
      makeReq("DELETE", "http://localhost/api/admin/courses/course-abc"),
      { params: Promise.resolve({ id: "course-abc" }) }
    );
    expect(res.status).toBe(401);
  });

  it("deletes the course and returns { success: true }", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.course.delete as jest.Mock).mockResolvedValueOnce(COURSE_ROW);

    const res = await DELETE(
      makeReq("DELETE", "http://localhost/api/admin/courses/course-abc"),
      { params: Promise.resolve({ id: "course-abc" }) }
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
  });

  it("calls db.course.delete with the correct id", async () => {
    (getServerSession as jest.Mock).mockResolvedValueOnce(SESSION);
    (db.course.delete as jest.Mock).mockResolvedValueOnce(COURSE_ROW);

    await DELETE(
      makeReq("DELETE", "http://localhost/api/admin/courses/course-abc"),
      { params: Promise.resolve({ id: "course-abc" }) }
    );
    expect(db.course.delete).toHaveBeenCalledWith({ where: { id: "course-abc" } });
  });
});
