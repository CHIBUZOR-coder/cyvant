import { render, screen, waitFor } from "@testing-library/react";
import WebinarBanner from "@/components/ui/WebinarBanner";
import type { Webinar } from "@/types";

const mockWebinar: Webinar = {
  id: "w1",
  title: "Intro to Cybersecurity for Beginners",
  date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
  registerUrl: "#register",
  active: true,
};

function mockFetch(payload: unknown) {
  global.fetch = jest.fn().mockResolvedValue({
    json: async () => payload,
  } as Response);
}

describe("WebinarBanner", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the banner with webinar title and Register link when active webinar exists", async () => {
    mockFetch({ webinar: mockWebinar });
    render(<WebinarBanner />);

    await waitFor(() => {
      expect(screen.getByText(/Intro to Cybersecurity for Beginners/i)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
    });
  });

  it("renders nothing when no active webinar", async () => {
    mockFetch({ webinar: null });
    const { container } = render(<WebinarBanner />);

    await waitFor(() => {
      expect(container.firstChild).toBeNull();
    });
  });
});
