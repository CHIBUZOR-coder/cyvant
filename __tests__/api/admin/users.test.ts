/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

jest.mock("next-auth", () => ({ getServerSession: jest.fn() }));
jest.mock("@/lib/auth", () => ({ authOptions: {} }));
jest.mock("bcryptjs", () => ({ hash: jest.fn().mockResolvedValue("hashed-password") }));
jest.mock("@/lib/db", () => ({
  db: {
    adminUser: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { GET, POST } from "@/app/api/cyvant-hq/users/route";

const adminSession = { user: { name: "Admin", email: "admin@cyvant.com", role: "admin" } };
const marketerSession = { user: { name: "Mark", email: "mark@cyvant.com", role: "marketer" } };

function makeReq(url: string, method = "GET", body?: unknown): NextRequest {
  return new NextRequest(url, {
    method,
    ...(body ? { body: JSON.stringify(body), headers: { "Content-Type": "application/json" } } : {}),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  (getServerSession as jest.Mock).mockResolvedValue(adminSession);
});

// ─── GET /api/cyvant-hq/users ─────────────────────────────────────────────────

describe("GET /api/cyvant-hq/users", () => {
  it("returns 403 when not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(403);
  });

  it("returns 403 for marketer role", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(marketerSession);
    const res = await GET();
    expect(res.status).toBe(403);
  });

  it("returns user list for admin", async () => {
    const users = [{ id: "u1", name: "Admin", email: "admin@cyvant.com", role: "admin", createdAt: "2025-01-01T00:00:00.000Z" }];
    (db.adminUser.findMany as jest.Mock).mockResolvedValue(users);

    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toEqual(users);
  });
});

// ─── POST /api/cyvant-hq/users ────────────────────────────────────────────────

describe("POST /api/cyvant-hq/users", () => {
  it("returns 403 for non-admin", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(marketerSession);
    const res = await POST(makeReq("http://localhost/api/cyvant-hq/users", "POST", {
      name: "New", email: "new@test.com", password: "password123", role: "marketer",
    }));
    expect(res.status).toBe(403);
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeReq("http://localhost/api/cyvant-hq/users", "POST", {
      name: "", email: "new@test.com", password: "password123", role: "marketer",
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is too short", async () => {
    const res = await POST(makeReq("http://localhost/api/cyvant-hq/users", "POST", {
      name: "New User", email: "new@test.com", password: "short", role: "marketer",
    }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid role", async () => {
    const res = await POST(makeReq("http://localhost/api/cyvant-hq/users", "POST", {
      name: "New User", email: "new@test.com", password: "password123", role: "superuser",
    }));
    expect(res.status).toBe(400);
  });

  it("returns 409 when email already exists", async () => {
    (db.adminUser.findUnique as jest.Mock).mockResolvedValue({ id: "existing" });
    const res = await POST(makeReq("http://localhost/api/cyvant-hq/users", "POST", {
      name: "Dupe", email: "dupe@test.com", password: "password123", role: "marketer",
    }));
    expect(res.status).toBe(409);
  });

  it("creates user and returns 201", async () => {
    (db.adminUser.findUnique as jest.Mock).mockResolvedValue(null);
    const created = { id: "u2", name: "Jane", email: "jane@test.com", role: "marketer", createdAt: "2025-01-01T00:00:00.000Z" };
    (db.adminUser.create as jest.Mock).mockResolvedValue(created);

    const res = await POST(makeReq("http://localhost/api/cyvant-hq/users", "POST", {
      name: "Jane", email: "jane@test.com", password: "password123", role: "marketer",
    }));
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.email).toBe("jane@test.com");
    expect(data).not.toHaveProperty("passwordHash");
  });

  it("hashes the password before storing", async () => {
    (db.adminUser.findUnique as jest.Mock).mockResolvedValue(null);
    (db.adminUser.create as jest.Mock).mockResolvedValue({ id: "u3", name: "X", email: "x@test.com", role: "marketer", createdAt: "2025-01-01T00:00:00.000Z" });

    await POST(makeReq("http://localhost/api/cyvant-hq/users", "POST", {
      name: "X", email: "x@test.com", password: "plaintext1", role: "marketer",
    }));

    expect(db.adminUser.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ passwordHash: "hashed-password" }),
      })
    );
  });
});
