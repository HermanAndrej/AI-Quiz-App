import Header from "@/components/common/header"
import Footer from "@/components/common/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
}

export default function About() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <motion.h1
            className="text-4xl font-bold mb-4"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            About AI Quiz App
          </motion.h1>
          <motion.p
            className="text-muted-foreground mb-8 text-lg leading-relaxed"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            AI Quiz App is a modern web application designed to help users test and
            expand their knowledge through AI-generated quizzes. Whether you're a
            student, a professional, or just curious — we’ve got quizzes for you.
          </motion.p>

          <Separator className="mb-8" />

          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                title: "🚀 Built with Modern Tech",
                description:
                  "Powered by React, Vite, Tailwind CSS, and ShadCN UI for a fast, responsive experience.",
              },
              {
                title: "🧠 AI-Powered Quizzes",
                description:
                  "Quizzes are generated and graded using cutting-edge AI, offering a fresh experience every time.",
              },
            ].map(({ title, description }, i) => (
              <motion.div
                key={title}
                custom={i + 3}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
              >
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-2">{title}</h2>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <motion.div
              className="md:col-span-2"
              custom={5}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-2">💡 Our Mission</h2>
                  <p className="text-sm text-muted-foreground">
                    We're building tools that combine education and innovation — making
                    learning more accessible, personalized, and engaging.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <section className="mt-16">
            <motion.h2
              className="text-3xl font-bold mb-6"
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={6}
            >
              Frequently Asked Questions
            </motion.h2>

            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  value: "q1",
                  question: "How does the AI generate quizzes?",
                  answer:
                    "Our AI uses advanced natural language processing to create quiz questions based on the topic you select, ensuring variety and difficulty scaling.",
                },
                {
                  value: "q2",
                  question: "Is there a mobile app available?",
                  answer:
                    "Currently, AI Quiz App is a web-first experience optimized for mobile browsers. Native apps are planned for the future.",
                },
                {
                  value: "q3",
                  question: "Can I track my progress over time?",
                  answer:
                    "Yes! Once you register, your quiz history and performance stats are saved so you can track improvement.",
                },
                {
                  value: "q4",
                  question: "Is the app free to use?",
                  answer:
                    "The core quiz features are free, with optional premium plans for extra content and personalized coaching.",
                },
              ].map(({ value, question, answer }, i) => (
                <motion.div
                  key={value}
                  custom={i + 7}
                  initial="hidden"
                  animate="visible"
                  variants={fadeUp}
                >
                  <AccordionItem value={value}>
                    <AccordionTrigger>{question}</AccordionTrigger>
                    <AccordionContent>{answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
