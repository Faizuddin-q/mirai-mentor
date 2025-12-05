import QuestionareGenerator from "./_components/questionare-generator";

export default function QuestionarePage() {
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-6xl font-bold gradient-title">Questionare</h1>
        <p className="text-muted-foreground mt-2">
          Generate professional answers to company questions
        </p>
      </div>

      <QuestionareGenerator />
    </div>
  );
}

