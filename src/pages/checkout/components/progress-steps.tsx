interface ProgressStepsProps {
  currentStep: CheckoutStep;
}

export function ProgressSteps({ currentStep }: ProgressStepsProps) {
  return (
    <div className="flex items-center space-x-2 text-sm mb-8">
      <span
        className={
          currentStep === "information" ? "text-black" : "text-gray-400"
        }
      >
        INFORMATION
      </span>
      <span className="text-gray-400">›</span>
      <span
        className={currentStep === "shipping" ? "text-black" : "text-gray-400"}
      >
        SHIPPING
      </span>
      <span className="text-gray-400">›</span>
      <span
        className={currentStep === "payment" ? "text-black" : "text-gray-400"}
      >
        PAYMENT
      </span>
    </div>
  );
}
