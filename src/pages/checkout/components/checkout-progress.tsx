interface CheckoutProgressProps {
  currentStep: CheckoutStep;
}

export function CheckoutProgress({ currentStep }: CheckoutProgressProps) {
  return (
    <nav className="flex items-center space-x-4 text-sm mb-8">
      <span className={`${currentStep === 'information' ? 'text-black' : 'text-gray-400'}`}>
        INFORMATION
      </span>
      <span className="text-gray-400">›</span>
      <span className="text-gray-400">SHIPPING</span>
      <span className="text-gray-400">›</span>
      <span className="text-gray-400">PAYMENT</span>
    </nav>
  );
}

