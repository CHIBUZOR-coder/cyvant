import { render, screen } from "@testing-library/react";
import OutcomesStrip from "@/components/ui/OutcomesStrip";
import type { GraduateOutcome } from "@/types";

const verifiedOutcome: GraduateOutcome = {
  id: "1",
  name: "Ada Obi",
  role: "Security Analyst",
  company: "Accenture",
  permissionConfirmed: true,
};

const unverifiedOutcome: GraduateOutcome = {
  id: "2",
  name: "Bola Smith",
  role: "DevOps Engineer",
  company: "Some Co",
  permissionConfirmed: false,
};

describe("OutcomesStrip", () => {
  it("renders only outcomes with permissionConfirmed: true", () => {
    render(<OutcomesStrip outcomes={[verifiedOutcome, unverifiedOutcome]} />);
    expect(screen.getByText("Ada Obi")).toBeInTheDocument();
    expect(screen.queryByText("Bola Smith")).not.toBeInTheDocument();
  });

  it("renders nothing (null) when no verified outcomes exist", () => {
    const { container } = render(<OutcomesStrip outcomes={[unverifiedOutcome]} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when outcomes array is empty", () => {
    const { container } = render(<OutcomesStrip outcomes={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
