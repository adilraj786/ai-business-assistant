export function Footer() {
  return (
    <footer className="border-t px-4 py-10">
      <div className="mx-auto max-w-5xl text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ShopAssist AI. Built for small businesses.
      </div>
    </footer>
  )
}