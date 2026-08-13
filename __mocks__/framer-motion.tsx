import React from "react";

type AnyProps = Record<string, unknown>;

function createPassthrough(tag: string) {
  return React.forwardRef<HTMLElement, AnyProps>(function MotionEl(
    { children, initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, viewport, ...rest },
    ref
  ) {
    return React.createElement(tag, { ...rest, ref }, children);
  });
}

const motion = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return createPassthrough(prop);
    },
  }
) as Record<string, ReturnType<typeof createPassthrough>>;

function AnimatePresence({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function useAnimation() {
  return { start: () => {}, set: () => {} };
}

function useInView() {
  return true;
}

export { motion, AnimatePresence, useAnimation, useInView };
