import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TeamManager from "@/components/admin/TeamManager";

const mockUsers = [
  { id: "u1", name: "Alice Admin", email: "alice@cyvant.com", role: "admin", createdAt: "2025-01-01T00:00:00Z" },
  { id: "u2", name: "Bob Marketer", email: "bob@cyvant.com", role: "marketer", createdAt: "2025-02-01T00:00:00Z" },
];

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => mockUsers,
  } as Response);
});

describe("TeamManager", () => {
  it("loads and displays team members", async () => {
    render(<TeamManager />);
    await waitFor(() => expect(screen.getByText("Alice Admin")).toBeInTheDocument());
    expect(screen.getByText("bob@cyvant.com")).toBeInTheDocument();
    expect(screen.getByText("2 members")).toBeInTheDocument();
  });

  it("shows role badges", async () => {
    render(<TeamManager />);
    await waitFor(() => screen.getByText("Alice Admin"));
    expect(screen.getByText("admin")).toBeInTheDocument();
    expect(screen.getByText("marketer")).toBeInTheDocument();
  });

  it("opens modal when Add Team Member is clicked", async () => {
    render(<TeamManager />);
    await waitFor(() => screen.getByText("Alice Admin"));
    fireEvent.click(screen.getByText("+ Add Team Member"));
    expect(screen.getByText("Add Team Member")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jane Doe")).toBeInTheDocument();
  });

  it("closes modal on Cancel", async () => {
    render(<TeamManager />);
    await waitFor(() => screen.getByText("Alice Admin"));
    fireEvent.click(screen.getByText("+ Add Team Member"));
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => expect(screen.queryByPlaceholderText("Jane Doe")).not.toBeInTheDocument());
  });

  it("shows error when API returns an error", async () => {
    render(<TeamManager />);
    await waitFor(() => screen.getByText("Alice Admin"));
    fireEvent.click(screen.getByText("+ Add Team Member"));

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "An account with that email already exists." }),
    });

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Jane Doe"), "Alice");
    await user.type(screen.getByPlaceholderText("jane@cyvant.com"), "alice@cyvant.com");
    await user.type(screen.getByPlaceholderText("Min. 8 characters"), "password123");
    fireEvent.click(screen.getByRole("button", { name: "Add Member" }));

    await waitFor(() =>
      expect(screen.getByText("An account with that email already exists.")).toBeInTheDocument()
    );
  });

  it("re-fetches member list after successful add", async () => {
    const newUser = { id: "u3", name: "Carol", email: "carol@cyvant.com", role: "marketer", createdAt: "2025-03-01T00:00:00Z" };

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => mockUsers })       // initial load
      .mockResolvedValueOnce({ ok: true, json: async () => newUser })         // POST
      .mockResolvedValueOnce({ ok: true, json: async () => [...mockUsers, newUser] }); // re-fetch

    render(<TeamManager />);
    await waitFor(() => screen.getByText("Alice Admin"));
    fireEvent.click(screen.getByText("+ Add Team Member"));

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("Jane Doe"), "Carol");
    await user.type(screen.getByPlaceholderText("jane@cyvant.com"), "carol@cyvant.com");
    await user.type(screen.getByPlaceholderText("Min. 8 characters"), "password123");
    fireEvent.click(screen.getByRole("button", { name: "Add Member" }));

    await waitFor(() => expect(screen.getByText("Carol")).toBeInTheDocument());
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });
});
