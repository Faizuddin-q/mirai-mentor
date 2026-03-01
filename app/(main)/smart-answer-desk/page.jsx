import QuestionareGenerator from "./_components/smart-answer-desk";

export default function QuestionarePage() {
  return (
    <div>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-6xl font-bold gradient-title">Smart Answer Desk</h1>
        <p className="text-muted-foreground mt-2">
          Generate professional answers to company questions
        </p>
      </div>

      <QuestionareGenerator />
    </div>
  );
}
