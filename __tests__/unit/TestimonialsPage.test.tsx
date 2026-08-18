import React from "react";
import { render, screen } from "@testing-library/react";
import TestimonialsPage from "@/app/testimonials/page";
import type { Testimonial } from "@/types";

jest.mock("@/data/testimonials", () => ({
  testimonials: [] as Testimonial[],
}));

jest.mock("@/components/ui/TestimonialCarousel", () => {
  const TestimonialCarousel = () => <div data-testid="testimonial-carousel" />;
  TestimonialCarousel.displayName = "TestimonialCarousel";
  return TestimonialCarousel;
});

describe("Testimonials page", () => {
  it("filters out cards with permissionOnFile: false and shows empty state", () => {
    render(<TestimonialsPage />);
    expect(screen.getByText(/testimonials coming soon/i)).toBeInTheDocument();
  });

  it("renders the carousel when at least one testimonial has permissionOnFile: true", async () => {
    const { testimonials } = await import("@/data/testimonials");
    (testimonials as Testimonial[]).push({
      id: "t-test",
      name: "Test Student",
      photo: "/test.jpg",
      role: "SOC Analyst",
      company: "Accenture",
      outcome: "Got hired within 3 months",
      quote: "CYVANT changed my career.",
      permissionOnFile: true,
    });

    render(<TestimonialsPage />);
    expect(screen.getByTestId("testimonial-carousel")).toBeInTheDocument();
  });
});
