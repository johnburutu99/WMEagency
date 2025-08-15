import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Loader2 } from "lucide-react";

export function ProgressTracker() {
  const steps = [
    { name: "Verify Email", status: "completed" },
    { name: "Upload Documents", status: "completed" },
    { name: "Sign Contract", status: "current" },
    { name: "Make Initial Payment", status: "upcoming" },
  ];

  const completedSteps = steps.filter((step) => step.status === "completed").length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Onboarding Progress</h3>
      <Progress value={progressPercentage} className="mb-4" />
      <ol className="space-y-4">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="flex items-center">
            {step.status === "completed" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : step.status === "current" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}
            <span className="ml-3">{step.name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
