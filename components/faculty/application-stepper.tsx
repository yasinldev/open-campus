'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface ApplicationStepperProps {
  steps: Step[];
  currentStep: number;
  locale: string;
}

export function ApplicationStepper({ steps, currentStep, locale }: ApplicationStepperProps) {
  return (
    <nav aria-label="Progress" className="overflow-x-auto">
      <ol role="list" className="space-y-3 md:flex md:space-x-6 lg:space-x-8 md:space-y-0 pb-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <li key={step.id} className="md:flex-1 md:min-w-0">
              <div
                className={cn(
                  'group flex flex-col border-l-4 py-2 pl-3 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-3 lg:pt-4',
                  isCompleted && 'border-primary',
                  isCurrent && 'border-primary',
                  !isCompleted && !isCurrent && 'border-border'
                )}
              >
                <span className="text-sm font-medium">
                  <span
                    className={cn(
                      'inline-flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-full border-2',
                      isCompleted && 'border-primary bg-primary text-primary-foreground',
                      isCurrent && 'border-primary bg-background text-primary',
                      !isCompleted && !isCurrent && 'border-border bg-background text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 md:h-5 md:w-5" />
                    ) : (
                      <span className="text-xs md:text-sm">{stepNumber}</span>
                    )}
                  </span>
                </span>
                <span className="mt-1.5 md:mt-2 text-xs md:text-sm font-medium text-foreground line-clamp-2">
                  {step.title}
                </span>
                <span className="mt-0.5 md:mt-1 text-[10px] md:text-xs text-muted-foreground line-clamp-2 hidden sm:block">
                  {step.description}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

