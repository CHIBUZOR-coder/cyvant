import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WebinarForm from "@/components/forms/WebinarForm";

function mockFetch(ok: boolean) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => ({ success: ok }),
  } as Response);
}

describe("WebinarForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  afterEach(() => jest.restoreAllMocks());

  it("renders all required fields and the consent checkbox", () => {
    render(<WebinarForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/pulling you toward/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("disables submit and shows errors when consent is unchecked", async () => {
    const user = userEvent.setup();
    render(<WebinarForm />);
    await user.click(screen.getByRole("button", { name: /register/i }));
    expect(await screen.findByText(/you must agree/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("shows validation error for invalid email on submit", async () => {
    const user = userEvent.setup();
    render(<WebinarForm />);
    await user.type(screen.getByLabelText(/full name/i), "Test User");
    await user.type(screen.getByLabelText(/email/i), "not-an-email");
    await user.type(screen.getByLabelText(/phone/i), "+2348012345678");
    await user.type(screen.getByLabelText(/pulling you toward/i), "Interested in cybersecurity");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /register/i }));
    expect(await screen.findByText(/valid email/i)).toBeInTheDocument();
  });

  it("shows success message after valid submission", async () => {
    mockFetch(true);
    const user = userEvent.setup();
    render(<WebinarForm />);
    await user.type(screen.getByLabelText(/full name/i), "Ada Obi");
    await user.type(screen.getByLabelText(/email/i), "ada@example.com");
    await user.type(screen.getByLabelText(/phone/i), "+2348012345678");
    await user.type(screen.getByLabelText(/pulling you toward/i), "Career change");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /register/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(/you're registered/i);
  });
});
