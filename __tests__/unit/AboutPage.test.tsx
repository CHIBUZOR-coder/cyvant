import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";

jest.mock("@/components/ui/ParticleCanvas", () => {
  const ParticleCanvas = () => null;
  ParticleCanvas.displayName = "ParticleCanvas";
  return ParticleCanvas;
});

describe("About page", () => {
  beforeEach(() => render(<AboutPage />));

  it("renders the About CYVANT heading", () => {
    expect(screen.getByRole("heading", { name: /About CYVANT/i })).toBeInTheDocument();
  });

  it("renders the founder section with Emmanuel Tavershima", () => {
    expect(screen.getByText("Emmanuel Tavershima")).toBeInTheDocument();
  });

  it("renders LinkedIn and GitHub links with noopener noreferrer", () => {
    const linkedinLinks = screen.getAllByRole("link", { name: /linkedin/i });
    const githubLinks = screen.getAllByRole("link", { name: /github/i });
    expect(linkedinLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
    expect(githubLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the Founders & Leadership section", () => {
    expect(screen.getByRole("heading", { name: /Founders & Leadership/i })).toBeInTheDocument();
  });

  it("renders the Program Highlights section", () => {
    expect(screen.getByRole("heading", { name: /Program Highlights/i })).toBeInTheDocument();
  });

  it("renders the Why CYVANT section with list items", () => {
    expect(screen.getByRole("heading", { name: /Why CYVANT\?/i })).toBeInTheDocument();
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBeGreaterThanOrEqual(3);
  });
});
