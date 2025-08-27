import { useState, useRef } from "react";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mail, MessageSquare, User } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLFormElement>(null); // ref for the form

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("🔥 FORM SUBMIT TRIGGERED!"); // Basic test
    e.preventDefault();
    console.log("🔥 preventDefault() called");
    
    if (!formRef.current) {
      console.log("❌ EmailJS Debug: Form ref is null");
      return;
    }
    console.log("✅ Form ref exists:", formRef.current);

    console.log("🚀 EmailJS Debug: Starting form submission");
    console.log("📝 EmailJS Debug: Form data:", {
      name: form.name,
      email: form.email,
      messageLength: form.message.length
    });
    
    // Debug environment variables
    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    
    console.log("🔑 EmailJS Debug: Environment check:", {
      serviceId: serviceId ? "✅ Present" : "❌ Missing",
      templateId: templateId ? "✅ Present" : "❌ Missing", 
      publicKey: publicKey ? "✅ Present" : "❌ Missing"
    });

    console.log("📤 EmailJS Debug: Sending email...");

    emailjs
      .sendForm(
        process.env.REACT_APP_EMAILJS_SERVICE_ID!,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID!,
        formRef.current,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY!
      )
      .then((result) => {
        console.log("✅ EmailJS Debug: Email sent successfully!", result);
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" }); // clear form
        console.log("🧹 EmailJS Debug: Form cleared");
      })
      .catch((err) => {
        console.error("❌ EmailJS Debug: Email failed to send:", err);
        console.error("❌ EmailJS Debug: Full error details:", {
          name: err.name,
          text: err.text,
          message: err.message,
          status: err.status
        });
        alert("Failed to send message. Please try again.");
      });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-20">
        <motion.div
          className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Text content */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Get in Touch</h1>
            <p className="text-muted-foreground text-lg">
              Have a question, feedback, or partnership idea? We’d love to hear from you. Fill out the form and our team will get back to you soon.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><Mail className="inline-block w-4 h-4 mr-2" /> support@aiquizapp.com</p>
              <p><MessageSquare className="inline-block w-4 h-4 mr-2" /> Live chat coming soon!</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-muted/40 p-6 rounded-xl shadow-md">
            {submitted ? (
              <motion.p
                className="text-green-600 text-lg font-medium text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                🎉 Thanks for reaching out! We’ll reply shortly.
              </motion.p>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-1 font-medium">
                    Your Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Doe"
                      className="w-full rounded-md border border-border px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block mb-1 font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-md border border-border px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-1 font-medium">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    required
                    placeholder="How can we help you?"
                    className="w-full rounded-md border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  onClick={() => console.log("🔥 BUTTON CLICKED!")}
                >
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
