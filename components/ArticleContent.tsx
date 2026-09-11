import BlogQuiz from "@/components/BlogQuiz";
import { splitQuizSegments } from "@/lib/blog-quiz";

// Renders CMS article HTML, swapping stored quiz blocks for the interactive quiz.
export default function ArticleContent({ html }: { html: string }) {
  return (
    <>
      {splitQuizSegments(html).map((segment, index) =>
        segment.type === "quiz" ? (
          <BlogQuiz key={segment.quiz.id} quiz={segment.quiz} />
        ) : (
          <div
            key={`html-${index}`}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: segment.html }}
          />
        ),
      )}
    </>
  );
}
