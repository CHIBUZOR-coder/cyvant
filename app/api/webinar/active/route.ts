import { NextResponse } from "next/server";
import { webinars } from "@/data/webinars";

export async function GET() {
  const now = new Date();
  const active = webinars.find(
    (w) => w.active && new Date(w.date) > now
  ) ?? null;

  return NextResponse.json({ webinar: active });
}
