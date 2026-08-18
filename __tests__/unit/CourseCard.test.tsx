import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CourseCard from "@/components/ui/CourseCard";
import type { Course } from "@/types";

const BASE_COURSE: Course = {
  id: "test-id-1",
  slug: "cyber-security-fundamentals",
  title: "Cyber Security Fundamentals",
  academy: "cybersecurity",
  tier: 1,
  level: "Beginner",
  duration: "6 Weeks",
  format: "Online, cohort-based",
  startingPrice: 200000,
  isStartHere: true,
  isMostPopular: false,
  featured: false,
  description: "The entry-level course for cybersecurity professionals.",
  prerequisites: ["None — ideal for beginners"],
  whatYouLearn: ["CIA Triad", "Network Basics", "Threat Actors"],
  certificationAlignment: ["CompTIA Security+"],
  careerPaths: ["SOC Analyst", "Security Engineer"],
};

describe("CourseCard — rendering", () => {
  it("renders the course title", () => {
    render(<CourseCard course={BASE_COURSE} />);
    expect(screen.getByText("Cyber Security Fundamentals")).toBeInTheDocument();
  });

  it("renders the correct tier label", () => {
    render(<CourseCard course={BASE_COURSE} />);
    expect(screen.getByText(/Tier 1/i)).toBeInTheDocument();
  });

  it("renders the level badge", () => {
    render(<CourseCard course={BASE_COURSE} />);
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });

  it("renders the course duration", () => {
    render(<CourseCard course={BASE_COURSE} />);
    expect(screen.getByText("6 Weeks")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<CourseCard course={BASE_COURSE} />);
    expect(
      screen.getByText("The entry-level course for cybersecurity professionals.")
    ).toBeInTheDocument();
  });

  it("shows 'Start Here' badge when isStartHere is true", () => {
    render(<CourseCard course={BASE_COURSE} />);
    expect(screen.getByText("Start Here")).toBeInTheDocument();
  });

  it("does not show 'Most Popular' badge when isMostPopular is false", () => {
    render(<CourseCard course={BASE_COURSE} />);
    expect(screen.queryByText("Most Popular")).not.toBeInTheDocument();
  });

  it("shows 'Most Popular' badge when isMostPopular is true", () => {
    render(<CourseCard course={{ ...BASE_COURSE, isStartHere: false, isMostPopular: true }} />);
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
  });

  it("does not show a path badge regardless of path value", () => {
    render(
      <CourseCard course={{ ...BASE_COURSE, tier: 3, path: "A", isStartHere: false }} />
    );
    expect(screen.queryByText("Path A")).not.toBeInTheDocument();
  });

  it("shows 'Details →' button", () => {
    render(<CourseCard course={BASE_COURSE} />);
    expect(screen.getByText("Details →")).toBeInTheDocument();
  });

  it("does not render a badge section when no badge applies", () => {
    render(
      <CourseCard
        course={{ ...BASE_COURSE, isStartHere: false, isMostPopular: false, path: undefined }}
      />
    );
    expect(screen.queryByText("Start Here")).not.toBeInTheDocument();
    expect(screen.queryByText("Most Popular")).not.toBeInTheDocument();
  });
});

describe("CourseCard — tier 2 variant", () => {
  const tier2: Course = {
    ...BASE_COURSE,
    id: "tier2-id",
    slug: "comptia-security-plus",
    title: "CompTIA Security+",
    tier: 2,
    level: "Intermediate",
    isStartHere: false,
    isMostPopular: true,
    startingPrice: 680000,
  };

  it("renders Tier 2 label", () => {
    render(<CourseCard course={tier2} />);
    expect(screen.getByText(/Tier 2/i)).toBeInTheDocument();
  });

  it("renders Intermediate level badge", () => {
    render(<CourseCard course={tier2} />);
    expect(screen.getByText("Intermediate")).toBeInTheDocument();
  });
});

describe("CourseCard — modal opens on Details click", () => {
  it("shows the modal with course title after clicking Details", () => {
    render(<CourseCard course={BASE_COURSE} />);
    fireEvent.click(screen.getByText("Details →"));
    const headings = screen.getAllByText("Cyber Security Fundamentals");
    expect(headings.length).toBeGreaterThan(1);
  });

  it("shows the 'Apply Now' link in the modal", () => {
    render(<CourseCard course={BASE_COURSE} />);
    fireEvent.click(screen.getByText("Details →"));
    expect(screen.getByText(/Apply Now/i)).toBeInTheDocument();
  });
});
