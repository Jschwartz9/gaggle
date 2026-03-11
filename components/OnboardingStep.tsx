'use client';

import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface OnboardingStepProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingStep({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Continue',
  nextDisabled = false,
  currentStep,
  totalSteps
}: OnboardingStepProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress Bar */}
      <div className="p-4 pt-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-sm text-muted mt-2">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text mb-2">{title}</h1>
          {subtitle && <p className="text-muted">{subtitle}</p>}
        </div>

        {/* Step Content */}
        <div className="flex-1">{children}</div>

        {/* Navigation */}
        <div className="space-y-3 pt-6">
          <button
            onClick={onNext}
            disabled={nextDisabled}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary text-deep rounded-lg font-medium disabled:bg-gray-200 disabled:text-muted transition-colors"
          >
            <span>{nextLabel}</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-3 px-4 border border-gray-300 text-muted rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}