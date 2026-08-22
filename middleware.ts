import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/cyvant-hq/login",
  },
});

export const config = {
  matcher: ["/cyvant-hq/((?!login|forgot-password|reset-password).*)"],
};
