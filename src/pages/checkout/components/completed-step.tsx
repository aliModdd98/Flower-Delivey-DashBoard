import { PenSquare } from 'lucide-react';

interface CompletedStepProps {
  title: string;
  onEdit: () => void;
}

export function CompletedStep({ title, onEdit }: CompletedStepProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-600 py-4">
      <div className="flex items-center space-x-2">
        <span className="text-green-500">✓</span>
        <h2 className="text-xl text-gray-400">{title}</h2>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-gray-400 hover:text-white"
      >
        <PenSquare className="w-5 h-5" />
      </button>
    </div>
  );
}

