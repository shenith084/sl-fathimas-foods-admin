// Route group layout — no extra wrapping needed since root layout handles Navbar/Footer
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
