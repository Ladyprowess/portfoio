"use client";

import { useRef, useState } from "react";
import posthog from "posthog-js";
import { quizLetters, type BlogQuiz as BlogQuizData } from "@/lib/blog-quiz";
import { launchConfetti } from "@/lib/confetti";

const praise = [
  "Congratulations, you got it right.",
  "You nailed it. Well done.",
  "Brilliant, that is the one.",
  "Spot on. You were paying attention.",
];

export default function BlogQuiz({ quiz }: { quiz: BlogQuizData }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const cardRef = useRef<HTMLElement>(null);
  const answered = choice !== null;
  const correct = choice === quiz.answer;

  function pick(index: number) {
    if (answered) return;
    setChoice(index);
    posthog.capture("blog_quiz_answered", {
      quiz_id: quiz.id,
      is_correct: index === quiz.answer,
    });
    if (index === quiz.answer) {
      setMessage(praise[Math.floor(Math.random() * praise.length)]);
      if (cardRef.current) launchConfetti(cardRef.current);
    }
  }

  return (
    <section
      ref={cardRef}
      id={quiz.id}
      aria-labelledby={`${quiz.id}-question`}
      className="my-10 scroll-mt-28 rounded-2xl border border-ink-border bg-surface-2 p-5 md:p-7"
    >
      <p className="font-head text-[0.62rem] font-bold uppercase tracking-[0.16em] text-primary">
        Quick quiz
      </p>
      <p
        id={`${quiz.id}-question`}
        className="mt-3 font-display text-xl font-extrabold leading-snug text-parchment md:text-[1.35rem]"
      >
        {quiz.question}
      </p>

      <div className="mt-5 grid gap-3" role="group" aria-label="Answer options">
        {quiz.options.map((option, index) => {
          const isAnswer = index === quiz.answer;
          const isChoice = index === choice;
          const tone = !answered
            ? "border-ink-border bg-white hover:-translate-y-px hover:border-primary hover:shadow-[0_6px_18px_rgba(37,99,235,0.1)]"
            : isAnswer
              ? "border-emerald-500 bg-emerald-50 text-emerald-950"
              : isChoice
                ? "border-red-400 bg-red-50 text-red-950"
                : "border-ink-border bg-white opacity-55";
          const badge = !answered
            ? "border-ink-border text-muted"
            : isAnswer
              ? "border-emerald-500 bg-emerald-500 text-white"
              : isChoice
                ? "border-red-400 bg-red-400 text-white"
                : "border-ink-border text-muted";

          return (
            <button
              key={index}
              type="button"
              disabled={answered}
              aria-pressed={isChoice}
              onClick={() => pick(index)}
              className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-[0.98rem] leading-6 text-parchment transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-default ${tone}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-head text-xs font-bold ${badge}`}
                aria-hidden
              >
                {answered && isAnswer ? "✓" : answered && isChoice ? "✕" : quizLetters[index]}
              </span>
              <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">{option}</span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite">
        {answered && (
          <div
            className={`mt-5 rounded-xl border p-4 md:p-5 ${correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
          >
            <p className={`font-display text-lg font-extrabold ${correct ? "text-emerald-900" : "text-red-900"}`}>
              {correct ? `🎉 Correct! ${message}` : "Not quite. That answer is wrong."}
            </p>
            {!correct && (
              <p className="mt-1.5 text-[0.95rem] leading-7 text-parchment">
                The correct answer is{" "}
                <strong>
                  {quizLetters[quiz.answer]}. {quiz.options[quiz.answer]}
                </strong>
              </p>
            )}
            {quiz.explanation && (
              <p className="mt-2 text-[0.95rem] leading-7 text-muted">{quiz.explanation}</p>
            )}
            {!correct && (
              <button
                type="button"
                onClick={() => setChoice(null)}
                className="mt-3 text-sm font-semibold text-primary underline underline-offset-4"
              >
                Try again
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
