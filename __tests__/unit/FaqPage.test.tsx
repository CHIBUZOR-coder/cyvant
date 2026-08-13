import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FaqPage from "@/app/faq/page";

describe("FAQ page", () => {
  beforeEach(() => render(<FaqPage />));

  it("renders all 6 FAQ questions", () => {
    expect(screen.getByText(/do i need a tech background/i)).toBeInTheDocument();
    expect(screen.getByText(/how much time does this require/i)).toBeInTheDocument();
    expect(screen.getByText(/certification or credential/i)).toBeInTheDocument();
    expect(screen.getByText(/career support after the program/i)).toBeInTheDocument();
    expect(screen.getByText(/payment structure/i)).toBeInTheDocument();
    expect(screen.getByText(/different from self-study/i)).toBeInTheDocument();
  });

  it("answers are hidden by default (accordion closed)", () => {
    const buttons = screen.getAllByRole("button");
    buttons.forEach((btn) => {
      expect(btn).toHaveAttribute("aria-expanded", "false");
    });
  });

  it("opens an accordion item on click and closes it on second click", async () => {
    const user = userEvent.setup();
    const firstButton = screen.getAllByRole("button")[0];

    await user.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "true");

    await user.click(firstButton);
    expect(firstButton).toHaveAttribute("aria-expanded", "false");
  });

  it("only one accordion item is open at a time", async () => {
    const user = userEvent.setup();
    const [first, second] = screen.getAllByRole("button");

    await user.click(first);
    expect(first).toHaveAttribute("aria-expanded", "true");

    await user.click(second);
    expect(first).toHaveAttribute("aria-expanded", "false");
    expect(second).toHaveAttribute("aria-expanded", "true");
  });

  it("renders the fallback 'Talk to us' CTA linking to /contact", () => {
    const ctas = screen.getAllByRole("link", { name: /talk to us/i });
    expect(ctas.length).toBeGreaterThanOrEqual(1);
    const fallbackCta = ctas[ctas.length - 1];
    expect(fallbackCta).toHaveAttribute("href", "/contact");
  });
});
