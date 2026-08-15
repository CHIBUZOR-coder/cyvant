"use client";

import { useEffect, useRef } from "react";

const NUM = 8;
const BASE_SIZE = 6;

export default function MouseFollower() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dots = useRef<{ x: number; y: number }[]>([]);
  const mouse = useRef({ x: -200, y: -200 });
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    dots.current = Array.from({ length: NUM }, () => ({ x: -200, y: -200 }));

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", onResize);

    function animate() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      const d = dots.current;

      for (let i = 0; i < NUM; i++) {
        if (i === 0) {
          d[0].x += (mouse.current.x - d[0].x) * 0.4;
          d[0].y += (mouse.current.y - d[0].y) * 0.4;
        } else {
          d[i].x += (d[i - 1].x - d[i].x) * 0.4;
          d[i].y += (d[i - 1].y - d[i].y) * 0.4;
        }
      }

      for (let i = 0; i < NUM; i++) {
        const radius = (BASE_SIZE - i * 0.5) / 2;
        const opacity = 0.55 - i * 0.05;
        ctx!.beginPath();
        ctx!.arc(d[i].x, d[i].y, radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(100,100,100,${opacity.toFixed(3)})`;
        ctx!.fill();
      }

      raf.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-9999"
      style={{ mixBlendMode: "difference" }}
    />
  );
}
