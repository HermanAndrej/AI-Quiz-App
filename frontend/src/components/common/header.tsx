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
import { X, Sparkles, LogOut, User, Menu } from "lucide-react";
import { isLoggedIn, removeAuthToken } from "@/lib/auth";

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
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md shadow-lg transition-all duration-500 ease-in-out">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary hover:scale-105 transition-transform duration-200"
        >
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          AI<span className="text-muted-foreground">Quiz</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          <NavigationMenu>
            <NavigationMenuList className="flex gap-2">
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
                      className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent/50 rounded-md transition-all duration-200 hover:scale-105"
                    >
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <Button variant="outline" onClick={handleLogout} className="hover:scale-105 transition-transform duration-200">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild className="hover:scale-105 transition-transform duration-200">
                <Link to="/login">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/80 hover:to-purple-600/80 hover:scale-105 transition-all duration-200 shadow-lg">
                <Link to="/register">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Sign Up
                </Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              className="md:hidden hover:scale-110 transition-transform duration-200"
            >
              <Menu className="h-6 w-6" />
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
