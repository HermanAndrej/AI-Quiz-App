import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, Lock } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import Header from "@/components/common/header"
import Footer from "@/components/common/footer"

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true);
    setError(null);
    try {
      const requestBody = JSON.stringify(form);
      const requestHeaders = { "Content-Type": "application/json" };
      console.log("[LOGIN] Sending request:", {
        url: "/api/auth/login",
        method: "POST",
        headers: requestHeaders,
        body: requestBody,
      });
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: requestHeaders,
        body: requestBody,
      });
      console.log("[LOGIN] Response status:", res.status);
      let data;
      try {
        data = await res.json();
        console.log("[LOGIN] Response body:", data);
      } catch (jsonErr) {
        console.log("[LOGIN] Failed to parse JSON response");
      }
      if (!res.ok) {
        throw new Error((data && data.detail) || "Login failed");
      }
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-20 flex justify-center items-center">
        <motion.div
          className="w-full max-w-md bg-muted/40 p-8 rounded-xl shadow-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="pl-10"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
          <p className="text-sm text-center text-muted-foreground mt-4">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
