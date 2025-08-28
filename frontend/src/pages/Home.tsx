import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { easeOut } from "framer-motion";
import { useEffect, useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: easeOut,
    },
  }),
};

import { getValidAuthToken, isLoggedIn } from "@/lib/auth";

type UserProfile = {
  user_id: number;
  email: string;
  username: string;
  joined_at: string;
};

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  
  // Check login status on component mount and when needed
  useEffect(() => {
    const checkLoginStatus = () => {
      const loginStatus = isLoggedIn();
      setLoggedIn(loginStatus);
      return loginStatus;
    };
    
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!loggedIn) {
      setLoading(false);
      setProfile(null);
      return;
    }
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      
      const token = getValidAuthToken();
      if (!token) {
        setLoading(false);
        setProfile(null);
        return;
      }
      
      try {
        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError("Welcome back!"); // fallback if profile fails
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [loggedIn]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {loggedIn && !loading ? (
          <motion.section
            className="py-20 text-center px-4"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            <motion.h1
              className="text-4xl sm:text-5xl font-bold tracking-tight"
              variants={fadeUp}
              custom={2}
            >
              {profile ? `Welcome back, ${profile.username}!` : error}
            </motion.h1>
            <motion.p
              className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg"
              variants={fadeUp}
              custom={3}
            >
              Ready to continue your learning journey?
            </motion.p>
            <motion.div
              className="mt-6 flex justify-center gap-4 flex-wrap"
              variants={fadeUp}
              custom={4}
            >
              <Button asChild size="lg">
                <Link to="/quiz">Take a Quiz</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/history">View History</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link to="/profile">Profile</Link>
              </Button>
            </motion.div>
          </motion.section>
        ) : (
          <>
            {/* 🟢 Hero Section for guests */}
            <motion.section
              className="py-20 text-center px-4"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={1}
            >
              <motion.h1
                className="text-4xl sm:text-5xl font-bold tracking-tight"
                variants={fadeUp}
                custom={2}
              >
                Learn Smarter with AI-Powered Quizzes
              </motion.h1>
              <motion.p
                className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg"
                variants={fadeUp}
                custom={3}
              >
                Personalized quizzes that adapt to your knowledge level. Track
                progress, boost retention, and have fun while learning.
              </motion.p>
              <motion.div
                className="mt-6 flex justify-center gap-4"
                variants={fadeUp}
                custom={4}
              >
                <Button asChild size="lg">
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </motion.div>
            </motion.section>
          </>
        )}

        {/* 🟢 Features Section */}
        <motion.section
          className="py-16 bg-muted/40 px-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={5}
        >
          <div className="container mx-auto text-center">
            <motion.h2
              className="text-2xl font-semibold mb-10"
              variants={fadeUp}
              custom={6}
            >
              Why Choose Us?
            </motion.h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Adaptive Learning",
                  desc: "The AI adapts each quiz to match your skills and push your limits.",
                },
                {
                  title: "Instant Feedback",
                  desc: "See what you got right and where you can improve — instantly.",
                },
                {
                  title: "Track Your Progress",
                  desc: "Visual stats and score history help you stay on track.",
                },
              ].map(({ title, desc }, i) => (
                <motion.div
                  key={title}
                  className="p-6 rounded-lg border bg-background shadow-sm"
                  variants={fadeUp}
                  custom={7 + i}
                >
                  <h3 className="text-lg font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section (visitor only)*/}
        {!loggedIn && (
          <motion.section
            className="py-24 bg-muted/40 border-t"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={10}
          >
            <div className="container mx-auto px-4 text-center">
              <motion.h2
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
                variants={fadeUp}
                custom={11}
              >
                Ready to start your journey?
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg max-w-xl mx-auto mb-8"
                variants={fadeUp}
                custom={12}
              >
                Sign up now and experience the smartest way to learn with
                AI-powered quizzes tailored just for you.
              </motion.p>
              <motion.div
                className="flex justify-center gap-4"
                variants={fadeUp}
                custom={13}
              >
                <Button size="lg" asChild>
                  <Link to="/register">Create Your Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/about">See How It Works</Link>
                </Button>
              </motion.div>
            </div>
          </motion.section>
        )}
        {/* Debug: CTA visibility - loggedIn: {loggedIn.toString()} */}
      </main>
      <Footer />
    </div>
  );
}
