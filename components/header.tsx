import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full border-b h-14 shrink-0 bg-background backdrop-blur-xl">
      <h1 className="text-xl font-bold p-2 font-mono">ToolCall</h1>
      <nav className="p-2">
        <ThemeToggle />
      </nav>
    </header>
  )
}