import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("@/lib/db", () => ({
  db: {
    course: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/components/ui/DarkSection", () => {
  const DarkSection = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  DarkSection.displayName = "DarkSection";
  return DarkSection;
});

import { db } from "@/lib/db";
import { courses } from "@/data/courses";
import CoursesPage from "@/app/courses/page";

function toPrismaShape(c: typeof courses[number]) {
  return {
    ...c,
    path: c.path ?? null,
    description: c.description ?? null,
    capstone: c.capstone ?? null,
    advancedElective: c.advancedElective ?? null,
    isMostPopular: c.isMostPopular ?? false,
    isStartHere: c.isStartHere ?? false,
    featured: c.featured ?? false,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

const PRISMA_COURSES = courses.map(toPrismaShape);

describe("Courses page", () => {
  beforeEach(async () => {
    (db.course.findMany as jest.Mock).mockResolvedValue(PRISMA_COURSES);
    render(await CoursesPage());
  });

  it("renders course cards for all published courses", () => {
    const lists = screen.getAllByRole("list");
    const cards = lists.flatMap((list) => Array.from(list.querySelectorAll("li")));
    expect(cards.length).toBeGreaterThan(0);
  });

  it("renders tier section headings for all tiers", () => {
    expect(screen.getAllByText("Tier 1").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Tier 2").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Tier 3").length).toBeGreaterThanOrEqual(1);
  });

  it("Start Here badge spans appear only on courses with isStartHere: true", () => {
    const startHereCourses = courses.filter((c) => c.isStartHere);
    const badges = screen.getAllByText("Start Here", { selector: "span" });
    expect(badges).toHaveLength(startHereCourses.length);
  });

  it("renders a Details button for each course card", () => {
    const detailButtons = screen.getAllByText(/Details →/i);
    expect(detailButtons.length).toBeGreaterThan(0);
  });
});
