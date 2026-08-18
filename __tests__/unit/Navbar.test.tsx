import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/layout/Navbar";

// next/navigation mock
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("Navbar", () => {
  it("renders all 6 navigation links", () => {
    render(<Navbar />);
    const links = ["Home", "About", "Services", "Courses", "Testimonials", "FAQ"];
    links.forEach((label) => {
      expect(screen.getAllByRole("link", { name: label })[0]).toBeInTheDocument();
    });
  });

  it("renders the primary CTA button with correct label and href", () => {
    render(<Navbar />);
    const cta = screen.getByRole("link", { name: /explore courses/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/#courses");
  });

  it("hamburger button toggles mobile menu open and closed", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    const hamburger = screen.getByRole("button", { name: /open menu/i });

    // Menu should not be visible initially
    expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();

    await user.click(hamburger);
    expect(screen.getByRole("navigation", { name: /mobile navigation/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /close menu/i }));
    expect(screen.queryByRole("navigation", { name: /mobile navigation/i })).not.toBeInTheDocument();
  });

  it("marks the active link with aria-current=page", () => {
    render(<Navbar />);
    // usePathname mocked to "/"
    const homeLinks = screen.getAllByRole("link", { name: "Home" });
    const activeHome = homeLinks.find((el) => el.getAttribute("aria-current") === "page");
    expect(activeHome).toBeDefined();
  });
});
