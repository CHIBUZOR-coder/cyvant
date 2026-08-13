import { render, screen } from "@testing-library/react";
import HeroSection from "@/components/ui/HeroSection";

describe("HeroSection", () => {
  beforeEach(() => render(<HeroSection />));

  it("renders the hero headline", () => {
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the sub-headline", () => {
    expect(screen.getByText(/AI and cybersecurity education/i)).toBeInTheDocument();
  });

  it("renders a primary CTA with highest-contrast class and correct href", () => {
    const cta = screen.getByRole("link", { name: /start your journey/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/courses");
    // Primary CTA is white button on dark background (white = brand primary)
    expect(cta).toHaveClass("bg-white");
  });

  it("renders the starting price signal", () => {
    expect(screen.getByText(/Programs from/i)).toBeInTheDocument();
  });

  it("renders the secondary CTA as a smaller subordinate link (no button class)", () => {
    const secondary = screen.getByRole("link", { name: /talk to us/i });
    expect(secondary).toBeInTheDocument();
    expect(secondary).not.toHaveClass("bg-white");
  });
});
