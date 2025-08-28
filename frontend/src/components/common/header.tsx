import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { isLoggedIn, removeAuthToken } from "@/lib/auth";
import { getNavigationItems } from "@/config/navigation";

export default function Header() {
  const [, forceUpdate] = useState({});

  // Force a re-render when storage changes (e.g., login/logout in another tab)
  useEffect(() => {
    const handler = () => forceUpdate({});
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Optional: also re-check token validity every 30s in case it expires silently
  useEffect(() => {
    const interval = setInterval(() => forceUpdate({}), 30 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    removeAuthToken();
    window.location.href = "/";
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-background/80 backdrop-blur shadow-sm transition-all duration-500 ease-in-out`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold tracking-tight text-primary">
          AI<span className="text-muted-foreground">Quiz</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-6">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                ...(loggedIn
                  ? [
                      { href: "/quiz", label: "Quiz" },
                      { href: "/history", label: "History" },
                      { href: "/profile", label: "Profile" },
                    ]
                  : []),
              ].map(({ href, label }) => (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={href}
                      className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex items-center gap-2">
          {loggedIn ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* MOBILE MENU */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 p-6">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="text-xl font-bold tracking-tight">
                AI<span className="text-muted-foreground">Quiz</span>
              </Link>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" aria-label="Close menu">
                  <X className="h-6 w-6" />
                </Button>
              </SheetClose>
            </div>
            <nav className="flex flex-col space-y-4">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/contact", label: "Contact" },
                ...(loggedIn
                  ? [
                      { href: "/quiz", label: "Quiz" },
                      { href: "/history", label: "History" },
                      { href: "/profile", label: "Profile" },
                    ]
                  : []),
              ].map(({ href, label }) => (
                <SheetClose asChild key={href}>
                  <Link
                    to={href}
                    className="text-base font-medium hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
            <div className="mt-8 flex flex-col space-y-3">
              {loggedIn ? (
                <SheetClose asChild>
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </SheetClose>
              ) : (
                <>
                  <SheetClose asChild>
                    <Button variant="outline" asChild>
                      <Link to="/login">Login</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild>
                      <Link to="/register">Sign Up</Link>
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
