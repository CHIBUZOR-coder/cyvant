import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GeneralContactForm from "@/components/forms/GeneralContactForm";

function mockFetch(ok: boolean) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    json: async () => ({ success: ok }),
  } as Response);
}

describe("GeneralContactForm", () => {
  afterEach(() => jest.restoreAllMocks());

  it("renders name, email, message and consent fields", () => {
    render(<GeneralContactForm />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("shows validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    render(<GeneralContactForm />);
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("shows success message after valid submission", async () => {
    mockFetch(true);
    const user = userEvent.setup();
    render(<GeneralContactForm />);
    await user.type(screen.getByLabelText(/full name/i), "Emeka Jones");
    await user.type(screen.getByLabelText(/email/i), "emeka@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello there!");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(/message received/i);
  });
});
