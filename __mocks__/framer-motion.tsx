import React from "react";

type AnyProps = Record<string, unknown>;
type PassthroughComponent = ReturnType<typeof React.forwardRef<HTMLElement, AnyProps>>;

const cache = new Map<string, PassthroughComponent>();

function createPassthrough(tag: string): PassthroughComponent {
  if (cache.has(tag)) return cache.get(tag)!;
  const Component = React.forwardRef<HTMLElement, AnyProps>(function MotionEl(
    { children, initial, animate, exit, transition, variants, whileHover, whileTap, whileInView, viewport, custom, ...rest },
    ref
  ) {
    return React.createElement(tag, { ...rest, ref }, children as React.ReactNode);
  });
  Component.displayName = `motion.${tag}`;
  cache.set(tag, Component);
  return Component;
}

const motion = new Proxy(
  {},
  {
    get(_target, prop: string) {
      return createPassthrough(prop);
    },
  }
) as Record<string, PassthroughComponent>;

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
