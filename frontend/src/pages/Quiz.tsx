import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

// Placeholder: Replace with your actual auth token retrieval logic
function getAuthToken() {
  return localStorage.getItem("token");
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

type QuizQuestion = {
  question_id: number;
  question_text: string;
  options: Record<string, string>;
};

type QuizResponse = {
  questions: QuizQuestion[];
  quiz_id: number;
  created_at: string;
  created_by: number;
};

type SubmitResponse = {
  score: number;
  total: number;
  message: string;
};

export default function Quiz() {
  const [form, setForm] = useState({
    topic: "",
    difficulty: "Easy",
    number_of_questions: 5,
  });
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuiz(null);
    setSubmitResult(null);
    setAnswers({});
    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          topic: form.topic,
          difficulty: form.difficulty,
          number_of_questions: Number(form.number_of_questions),
        }),
      });
      if (!res.ok) throw new Error("Failed to generate quiz");
      const data = await res.json();
      setQuiz(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (qid: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!quiz) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
        body: JSON.stringify({
          quiz_id: quiz.quiz_id,
          answers,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit quiz");
      const data = await res.json();
      setSubmitResult(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center">
        <Card className="w-full max-w-xl p-8 mb-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Generate a Quiz</h1>
          <form onSubmit={handleGenerate} className="space-y-5">
            <Input
              name="topic"
              value={form.topic}
              onChange={handleFormChange}
              placeholder="Quiz Topic (e.g. JavaScript, History)"
              required
              disabled={loading}
            />
            <select
              name="difficulty"
              value={form.difficulty}
              onChange={handleFormChange}
              className="w-full border rounded-md p-2"
              disabled={loading}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <Input
              type="number"
              name="number_of_questions"
              min={1}
              max={10}
              value={form.number_of_questions}
              onChange={handleFormChange}
              placeholder="Number of Questions"
              required
              disabled={loading}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Generating..." : "Generate Quiz"}
            </Button>
          </form>
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </Card>

        {quiz && (
          <Card className="w-full max-w-2xl p-8 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quiz: {form.topic} ({form.difficulty})</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitQuiz();
              }}
              className="space-y-6"
            >
              {quiz.questions.map((q, idx) => (
                <div key={q.question_id} className="mb-6">
                  <div className="font-medium mb-2">
                    {idx + 1}. {q.question_text}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(q.options).map(([key, val]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={`q_${q.question_id}`}
                          value={key}
                          checked={answers[q.question_id] === key}
                          onChange={() => handleAnswer(q.question_id, key)}
                          required
                          disabled={!!submitResult}
                        />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              {!submitResult && (
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Submitting..." : "Submit Quiz"}
                </Button>
              )}
            </form>
            {submitResult && (
              <div className="mt-6 text-center">
                <div className="text-lg font-bold mb-2">{submitResult.message}</div>
                <div className="text-2xl font-semibold">
                  Score: {submitResult.score} / 100
                </div>
              </div>
            )}
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
} 