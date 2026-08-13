/**
 * @jest-environment node
 */
import { GET } from "@/app/api/webinar/active/route";
import { NextRequest } from "next/server";

// Swap out the webinars data module so we control what the route sees
jest.mock("@/data/webinars", () => ({ webinars: [] }));

import { webinars } from "@/data/webinars";
import type { Webinar } from "@/types";

function makeRequest() {
  return new NextRequest("http://localhost/api/webinar/active");
}

describe("GET /api/webinar/active", () => {
  afterEach(() => {
    (webinars as Webinar[]).length = 0; // reset between tests
  });

  it("returns null when no webinars are configured", async () => {
    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.webinar).toBeNull();
  });

  it("returns null when all webinars have active: false", async () => {
    (webinars as Webinar[]).push({
      id: "w1",
      title: "Past Webinar",
      date: new Date(Date.now() + 86400000).toISOString(),
      registerUrl: "#",
      active: false,
    });
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.webinar).toBeNull();
  });

  it("returns null when webinar date is in the past", async () => {
    (webinars as Webinar[]).push({
      id: "w2",
      title: "Old Webinar",
      date: new Date(Date.now() - 86400000).toISOString(), // yesterday
      registerUrl: "#",
      active: true,
    });
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.webinar).toBeNull();
  });

  it("returns the active upcoming webinar", async () => {
    const upcoming: Webinar = {
      id: "w3",
      title: "Intro to Cybersecurity",
      date: new Date(Date.now() + 86400000).toISOString(),
      registerUrl: "#register",
      active: true,
    };
    (webinars as Webinar[]).push(upcoming);
    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.webinar).toMatchObject({ id: "w3", title: "Intro to Cybersecurity" });
  });
});
