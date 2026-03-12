/**
 * Layout for marketing pages (landing, etc.).
 * Navbar is in root layout; this wraps content in semantic main.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="min-h-screen">{children}</main>
}
