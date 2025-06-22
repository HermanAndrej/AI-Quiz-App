import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-muted/50 text-muted-foreground">
      <div className="container mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">AI Quiz App</h3>
          <p className="text-sm leading-relaxed">
            Build your knowledge with AI-powered quizzes. Fun, interactive, and educational.
          </p>
        </div>
        
        {/* Navigation Links */}
        <div>
          <h4 className="font-semibold mb-4">Navigate</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Account Links */}
        <div>
          <h4 className="font-semibold mb-4">Account</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:underline">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter / Social */}
        <div>
          <h4 className="font-semibold mb-4">Stay Updated</h4>
          <p className="text-sm mb-4">
            Subscribe to our newsletter to get the latest updates.
          </p>
          <form className="flex space-x-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-grow rounded-md border border-border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button type="submit" size="sm">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-border mt-8 py-4 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} AI Quiz App. All rights reserved.
      </div>
    </footer>
  )
}
