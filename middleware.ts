export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/admin/((?!login|forgot-password|reset-password).*)"],
};
