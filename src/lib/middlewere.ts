export { auth as middleware } from "./auth";

export const config = {
  // Semua path di bawah /dashboard akan diproteksi
  matcher: ["/dashboard/:path*"],
};
