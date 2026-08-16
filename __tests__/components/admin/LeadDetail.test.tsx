import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import LeadDetail from "@/components/admin/LeadDetail";

jest.mock("next/link", () => {
  const Link = ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    <a href={href} {...props}>{children}</a>;
  Link.displayName = "Link";
  return Link;
});

const baseLead = {
  id: "l1",
  name: "John Doe",
  email: "john@test.com",
  phone: "08012345678",
  company: null,
  leadSource: "website",
  courseInterest: "Cybersecurity Fundamentals",
  serviceInterest: null,
  qualifyingAnswer: null,
  message: null,
  leadScore: 75,
  status: "contacted",
  createdAt: "2025-01-01T00:00:00Z",
  notes: [],
  student: null,
};

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => baseLead,
  } as Response);
});

describe("LeadDetail", () => {
  it("renders lead name and email", async () => {
    render(<LeadDetail id="l1" />);
    await waitFor(() => expect(screen.getByText("John Doe")).toBeInTheDocument());
    expect(screen.getByText("john@test.com")).toBeInTheDocument();
  });

  it("shows status buttons for non-enrolled lead", async () => {
    render(<LeadDetail id="l1" />);
    await waitFor(() => screen.getByText("John Doe"));
    expect(screen.getByRole("button", { name: "enrolled" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "contacted" })).toBeInTheDocument();
  });

  it("shows the Log an interaction form when lead has no student", async () => {
    render(<LeadDetail id="l1" />);
    await waitFor(() => screen.getByText("Log an interaction"));
    expect(screen.getByText("Log an interaction")).toBeInTheDocument();
  });

  it("hides Log an interaction form when lead is converted to student", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...baseLead, status: "enrolled", student: { id: "s1" } }),
    });

    render(<LeadDetail id="l1" />);
    await waitFor(() => screen.getByText("John Doe"));
    expect(screen.queryByText("Log an interaction")).not.toBeInTheDocument();
  });

  it("shows Converted to student banner when student exists", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...baseLead, status: "enrolled", student: { id: "s1" } }),
    });

    render(<LeadDetail id="l1" />);
    await waitFor(() => screen.getByText("Converted to student"));
    expect(screen.getByText("View Student Profile →")).toBeInTheDocument();
  });

  it("shows read-only status badge when enrolled", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ...baseLead, status: "enrolled", student: { id: "s1" } }),
    });

    render(<LeadDetail id="l1" />);
    await waitFor(() => screen.getByText("John Doe"));
    // Status badge should be a span, not a button
    expect(screen.queryByRole("button", { name: "enrolled" })).not.toBeInTheDocument();
    expect(screen.getByText("enrolled")).toBeInTheDocument();
  });

  it("logs a note when form is submitted", async () => {
    const note = { id: "n1", content: "Called John", type: "call", createdBy: "Admin", createdAt: "2025-01-02T00:00:00Z" };
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => baseLead })
      .mockResolvedValueOnce({ ok: true, json: async () => note });

    render(<LeadDetail id="l1" />);
    await waitFor(() => screen.getByText("Log an interaction"));

    fireEvent.change(screen.getByPlaceholderText(/Add a note/i), { target: { value: "Called John" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(screen.getByText("Called John")).toBeInTheDocument());
  });
});
