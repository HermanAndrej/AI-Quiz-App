/**
 * Navigation configuration
 */

export interface NavigationItem {
  href: string;
  label: string;
  requiresAuth?: boolean;
}

export const baseNavItems: NavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const authenticatedNavItems: NavigationItem[] = [
  { href: "/quiz", label: "Quiz", requiresAuth: true },
  { href: "/history", label: "History", requiresAuth: true },
  { href: "/profile", label: "Profile", requiresAuth: true },
];

export const getNavigationItems = (isAuthenticated: boolean): NavigationItem[] => {
  return isAuthenticated 
    ? [...baseNavItems, ...authenticatedNavItems]
    : baseNavItems;
};
