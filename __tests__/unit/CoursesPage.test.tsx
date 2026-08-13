import { render, screen } from "@testing-library/react";
import CoursesPage from "@/app/courses/page";
import { courses } from "@/data/courses";

describe("Courses page", () => {
  beforeEach(() => render(<CoursesPage />));

  it("renders all 9 course cards", () => {
    const lists = screen.getAllByRole("list");
    const cards = lists.flatMap((list) => Array.from(list.querySelectorAll("li")));
    expect(cards).toHaveLength(9);
  });

  it("each card shows title, level, duration, format and price fields", () => {
    expect(screen.getAllByText("Duration").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Format").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("From").length).toBeGreaterThanOrEqual(1);
  });

  it("Start Here badge appears only on courses with isStartHere: true", () => {
    const startHereCourses = courses.filter((c) => c.isStartHere);
    const badges = screen.getAllByLabelText("Recommended starting point");
    expect(badges).toHaveLength(startHereCourses.length);
  });

  it("each course CTA points to the correct inquiry path", () => {
    const inquireLinks = screen.getAllByRole("link", { name: /inquire about/i });
    expect(inquireLinks).toHaveLength(9);
    inquireLinks.forEach((link) => {
      expect(link.getAttribute("href")).toMatch(/\/courses\/.+\/inquire/);
    });
  });
});
