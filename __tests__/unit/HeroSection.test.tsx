import { render, screen } from "@testing-library/react";
import HeroSection from "@/components/ui/HeroSection";

jest.mock("@/components/ui/ParticleCanvas", () => {
  const ParticleCanvas = () => null;
  ParticleCanvas.displayName = "ParticleCanvas";
  return ParticleCanvas;
});

describe("HeroSection", () => {
  beforeEach(() => render(<HeroSection />));

  it("renders the hero headline", () => {
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the sub-headline", () => {
    expect(screen.getByText(/Practical technology training/i)).toBeInTheDocument();
  });

  it("renders a primary CTA with correct label and href", () => {
    const cta = screen.getByRole("link", { name: /Kickstart Your Career/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/courses");
    expect(cta).toHaveClass("bg-[#007dff]");
  });

  it("renders the starting price signal", () => {
    expect(screen.getByText(/Programs starting from/i)).toBeInTheDocument();
  });

  it("renders the secondary CTA as a subordinate link", () => {
    const secondary = screen.getByRole("link", { name: /Contact Us/i });
    expect(secondary).toBeInTheDocument();
    expect(secondary).not.toHaveClass("bg-[#007dff]");
  });
});
