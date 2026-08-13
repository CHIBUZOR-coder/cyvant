import { render, screen } from "@testing-library/react";
import HowItWorks from "@/components/ui/HowItWorks";

const EXPECTED_STEPS = [
  "Learn",
  "Practice",
  "Build",
  "Present",
  "Defend",
  "Portfolio",
  "Opportunity",
];

describe("HowItWorks", () => {
  it("renders all 7 steps in the correct order", () => {
    render(<HowItWorks />);
    // Two lists exist: one for mobile, one for desktop — check both have the steps
    const lists = screen.getAllByRole("list", { name: /program steps/i });
    expect(lists.length).toBeGreaterThanOrEqual(1);
    const list = lists[0];
    const items = list.querySelectorAll("li");
    expect(items).toHaveLength(EXPECTED_STEPS.length);
    items.forEach((item, i) => {
      expect(item.textContent).toContain(EXPECTED_STEPS[i]);
    });
  });
});
