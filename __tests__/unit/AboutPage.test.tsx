import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";

describe("About page", () => {
  beforeEach(() => render(<AboutPage />));

  it("renders the mission section", () => {
    expect(screen.getByRole("heading", { name: /built to change who gets into tech/i })).toBeInTheDocument();
  });

  it("renders the founder section with Emmanuel Tavershima", () => {
    expect(screen.getByRole("heading", { name: /emmanuel tavershima/i })).toBeInTheDocument();
  });

  it("renders LinkedIn and GitHub links with noopener noreferrer", () => {
    const linkedin = screen.getByRole("link", { name: /linkedin/i });
    const github = screen.getByRole("link", { name: /github/i });
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the team section", () => {
    expect(screen.getByRole("heading", { name: /our team/i })).toBeInTheDocument();
    expect(screen.getByText("Content Creator")).toBeInTheDocument();
    expect(screen.getByText("Digital Marketer")).toBeInTheDocument();
  });

  it("renders the company story section", () => {
    expect(screen.getByRole("heading", { name: /why cyvant exists/i })).toBeInTheDocument();
  });

  it("renders the values section with at least 3 values", () => {
    expect(screen.getByRole("heading", { name: /what we stand for/i })).toBeInTheDocument();
    const list = screen.getByRole("list");
    expect(list.children.length).toBeGreaterThanOrEqual(3);
  });
});
