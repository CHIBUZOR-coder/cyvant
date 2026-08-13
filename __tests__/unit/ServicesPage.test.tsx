import { render, screen } from "@testing-library/react";
import ServicesPage from "@/app/services/page";

describe("Services page", () => {
  beforeEach(() => render(<ServicesPage />));

  it("renders all 3 service cards with a title and CTA", () => {
    expect(screen.getByText("Corporate Cybersecurity Awareness Training")).toBeInTheDocument();
    expect(screen.getByText("Custom Curriculum & Team Upskilling")).toBeInTheDocument();
    expect(screen.getByText("Partnership, Speaking & Consulting")).toBeInTheDocument();
  });

  it("each service CTA includes the correct pre-fill query param", () => {
    const ctaLinks = screen.getAllByRole("link").filter((el) =>
      el.getAttribute("href")?.startsWith("/contact?service=")
    );
    expect(ctaLinks).toHaveLength(3);
    const hrefs = ctaLinks.map((el) => el.getAttribute("href"));
    expect(hrefs).toContain("/contact?service=corporate-training");
    expect(hrefs).toContain("/contact?service=custom-curriculum");
    expect(hrefs).toContain("/contact?service=partnership-consulting");
  });
});
