import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface Step {
  id: string
  title: string
  description?: string
}

interface StepperContextValue {
  currentStep: number
  steps: Step[]
  goToStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const StepperContext = React.createContext<StepperContextValue | undefined>(undefined)

export function useStepper() {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error('useStepper must be used within a Stepper')
  }
  return context
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepChange?: (step: number) => void
  children: React.ReactNode
}

export function Stepper({ steps, currentStep, onStepChange, children }: StepperProps) {
  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      onStepChange?.(step)
    }
  }

  const nextStep = () => goToStep(currentStep + 1)
  const prevStep = () => goToStep(currentStep - 1)

  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <StepperContext.Provider
      value={{
        currentStep,
        steps,
        goToStep,
        nextStep,
        prevStep,
        isFirstStep,
        isLastStep,
      }}
    >
      {children}
    </StepperContext.Provider>
  )
}

export function StepperHeader() {
  const { steps, currentStep } = useStepper()

  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors',
                index < currentStep
                  ? 'border-primary bg-primary text-primary-foreground'
                  : index === currentStep
                    ? 'border-primary bg-background text-primary'
                    : 'border-muted-foreground/30 bg-background text-muted-foreground',
              )}
            >
              {index < currentStep ? (
                <Check className="h-5 w-5" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>
            <div className="text-center">
              <p
                className={cn(
                  'text-sm font-medium',
                  index === currentStep ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {step.title}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground">{step.description}</p>
              )}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'mx-4 h-[2px] flex-1 transition-colors',
                index < currentStep ? 'bg-primary' : 'bg-muted-foreground/30',
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

interface StepperContentProps {
  step: number
  children: React.ReactNode
}

export function StepperContent({ step, children }: StepperContentProps) {
  const { currentStep } = useStepper()

  if (currentStep !== step) return null

  return <div className="py-6">{children}</div>
}
