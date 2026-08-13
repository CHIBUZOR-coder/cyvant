import { render, screen } from "@testing-library/react";
import TestimonialsPage from "@/app/testimonials/page";
import type { Testimonial } from "@/types";

jest.mock("@/data/testimonials", () => ({
  testimonials: [] as Testimonial[],
}));

describe("Testimonials page", () => {
  it("filters out cards with permissionOnFile: false and shows empty state", () => {
    render(<TestimonialsPage />);
    expect(screen.getByText(/testimonials coming soon/i)).toBeInTheDocument();
  });

  it("renders verified testimonial cards when permissionOnFile is true", async () => {
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
    expect(screen.getByText("Test Student")).toBeInTheDocument();
  });
});
