import React from "react";
import { render, screen } from "@testing-library/react";

jest.mock("@/lib/db", () => ({
  db: {
    service: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/service-icons", () => ({
  SERVICE_ICONS: new Proxy({}, { get: () => null }),
}));

jest.mock("@/components/ui/FadeIn", () => {
  const FadeIn = ({ children }: { children: React.ReactNode }) => <>{children}</>;
  FadeIn.displayName = "FadeIn";
  return FadeIn;
});

jest.mock("@/components/ui/DarkSection", () => {
  const DarkSection = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
  DarkSection.displayName = "DarkSection";
  return DarkSection;
});

import { db } from "@/lib/db";
import ServicesPage from "@/app/services/page";

const SERVICES = [
  {
    id: "svc-1",
    slug: "corporate-training",
    number: "01",
    title: "Corporate Cybersecurity Awareness Training",
    description: "Train your team to recognise and respond to modern threats.",
    cta: "Get a Quote",
    icon: "shield",
    order: 1,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "svc-2",
    slug: "custom-curriculum",
    number: "02",
    title: "Custom Curriculum & Team Upskilling",
    description: "Bespoke training programmes tailored to your organisation.",
    cta: "Start a Conversation",
    icon: "book",
    order: 2,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "svc-3",
    slug: "partnership-consulting",
    number: "03",
    title: "Partnership, Speaking & Consulting",
    description: "Bring CYVANT expertise to your next event or project.",
    cta: "Get in Touch",
    icon: "users",
    order: 3,
    published: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("Services page", () => {
  beforeEach(async () => {
    (db.service.findMany as jest.Mock).mockResolvedValue(SERVICES);
    render(await ServicesPage());
  });

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
