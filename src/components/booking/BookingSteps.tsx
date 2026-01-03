import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookingStepsProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: 'Chọn phòng' },
  { number: 2, label: 'Thông tin & Thanh toán' },
  { number: 3, label: 'Xác nhận' },
];

const BookingSteps = ({ currentStep }: BookingStepsProps) => {
  return (
    <div className="w-full bg-card border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              {/* Step Circle */}
              <div className="flex items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all",
                    currentStep > step.number
                      ? "bg-green-500 text-white"
                      : currentStep === step.number
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {currentStep > step.number ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <span
                  className={cn(
                    "ml-3 text-sm font-medium hidden sm:block",
                    currentStep >= step.number
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 sm:w-24 lg:w-32 h-1 mx-3 sm:mx-4 rounded-full transition-all",
                    currentStep > step.number
                      ? "bg-green-500"
                      : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingSteps;
