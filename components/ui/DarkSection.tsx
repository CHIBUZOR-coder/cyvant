import ParticleCanvas from "./ParticleCanvas";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export default function DarkSection({ children, className = "" }: Props) {
  return (
    <section className={`relative overflow-hidden bg-slate-900 ${className}`}>
      <ParticleCanvas />
      <div className="relative z-10">{children}</div>
    </section>
  );
}
