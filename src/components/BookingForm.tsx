'use client';

import React, { useState, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  preferredService: 'Cleaning' | 'Whitening' | 'Restoration' | 'Consultation' | 'Other';
  preferredDate: string;
  preferredTime: string;
  message?: string;
}

export interface BookingFormProps {
  /** Optional custom submit callback. Receives validated form data. */
  onSubmit?: (data: BookingFormData) => Promise<void> | void;
  /** Optional custom class name */
  className?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  className = '',
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Compute min date (today) and max date (today + 60 days)
  const { minDate, maxDate } = useMemo(() => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 60);

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      minDate: formatDate(today),
      maxDate: formatDate(futureDate),
    };
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<BookingFormData>({
    mode: 'onChange', // Real-time validation
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      preferredService: 'Consultation',
      preferredDate: '',
      preferredTime: '',
      message: '',
    },
  });

  const messageText = watch('message') || '';

  const handleFormSubmit: SubmitHandler<BookingFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Send data to internal API endpoint or EmailJS webhook
        const response = await fetch('/api/booking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Server error while saving reservation');
        }
      }

      setSubmitSuccess(true);
      reset(); // Reset form after successful submission
    } catch (err: unknown) {
      console.error('Booking submission error:', err);
      // Even if network fails in local mock mode, allow simulated success or show friendly message
      setSubmitError('Unable to send request right now. Please call our clinic directly at (212) 555-0199.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full max-w-[600px] mx-auto p-6 sm:p-8 md:p-10 rounded-3xl bg-[#f0f9ff] border border-cyan-100 shadow-xl transition-all ${className}`}
    >
      {/* Form Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#06b6d4]/10 text-[#06b6d4] mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4] animate-pulse" />
          Direct Reservation
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Book Your Appointment
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
          WE DESIGN SMILES &bull; Luxury Cosmetic &amp; Restorative Care
        </p>
      </div>

      {/* Success Notification Banner */}
      {submitSuccess ? (
        <div className="py-8 px-6 rounded-2xl bg-white border border-emerald-200 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Thank you! We&apos;ll contact you soon.
          </h3>
          <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
            Your appointment inquiry has been received. Our concierge team will reach out via phone or email to confirm your time slot.
          </p>
          <button
            type="button"
            onClick={() => setSubmitSuccess(false)}
            className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-[#06b6d4] hover:bg-[#0891b2] shadow-md shadow-[#06b6d4]/20 transition-all cursor-pointer"
          >
            Book Another Visit
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(handleFormSubmit)} noValidate className="space-y-5">
          {/* Global error banner */}
          {submitError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{submitError}</span>
            </div>
          )}

          {/* 1. Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Name <span className="text-[#06b6d4]">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="e.g. John Doe"
              {...register('fullName', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent transition-all ${
                errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName.message}</p>
            )}
          </div>

          {/* 2. Email & 3. Phone (2-column layout on tablet/desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Email Address <span className="text-[#06b6d4]">*</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email format',
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent transition-all ${
                  errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Phone (10 digits) */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number <span className="text-[#06b6d4]">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="(212) 555-0199"
                {...register('phone', {
                  required: 'Phone number is required',
                  validate: (val) => {
                    const digits = val.replace(/\D/g, '');
                    return digits.length === 10 || 'Must be a valid 10-digit phone number';
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent transition-all ${
                  errors.phone ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone.message}</p>
              )}
            </div>
          </div>

          {/* 4. Preferred Service */}
          <div>
            <label htmlFor="preferredService" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Preferred Service <span className="text-[#06b6d4]">*</span>
            </label>
            <select
              id="preferredService"
              {...register('preferredService', {
                required: 'Please select a preferred service',
              })}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent transition-all cursor-pointer"
            >
              <option value="Cleaning">Cleaning &bull; Preventive Spa Care</option>
              <option value="Whitening">Whitening &bull; Laser Enamel Brightening</option>
              <option value="Restoration">Restoration &bull; Veneers &amp; Implants</option>
              <option value="Consultation">Consultation &bull; Comprehensive 3D Exam</option>
              <option value="Other">Other &bull; Bespoke Dental Treatment</option>
            </select>
          </div>

          {/* 5. Preferred Date & 6. Preferred Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preferred Date (today to today + 60 days) */}
            <div>
              <label htmlFor="preferredDate" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Preferred Date <span className="text-[#06b6d4]">*</span>
              </label>
              <input
                type="date"
                id="preferredDate"
                min={minDate}
                max={maxDate}
                {...register('preferredDate', {
                  required: 'Please pick a preferred date',
                  min: {
                    value: minDate,
                    message: 'Date cannot be in the past',
                  },
                  max: {
                    value: maxDate,
                    message: 'Booking window is within 60 days',
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent transition-all ${
                  errors.preferredDate ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              {errors.preferredDate && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.preferredDate.message}</p>
              )}
            </div>

            {/* Preferred Time (Business Hours 9:00 AM - 6:00 PM) */}
            <div>
              <label htmlFor="preferredTime" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Preferred Time <span className="text-[#06b6d4]">*</span>
              </label>
              <input
                type="time"
                id="preferredTime"
                min="09:00"
                max="18:00"
                step="900" // 15 min steps
                {...register('preferredTime', {
                  required: 'Please pick a time',
                  validate: (timeVal) => {
                    if (!timeVal) return 'Time is required';
                    if (timeVal < '09:00' || timeVal > '18:00') {
                      return 'Hours: 9:00 AM - 6:00 PM';
                    }
                    return true;
                  },
                })}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent transition-all ${
                  errors.preferredTime ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                }`}
              />
              <span className="block text-[10px] text-slate-500 mt-1">Hours: 9:00 AM &ndash; 6:00 PM</span>
              {errors.preferredTime && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.preferredTime.message}</p>
              )}
            </div>
          </div>

          {/* 7. Message (Optional, max 300 chars) */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Message <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {messageText.length}/300
              </span>
            </div>
            <textarea
              id="message"
              rows={3}
              placeholder="Tell us about any specific smile goals, tooth sensitivities, or anxieties..."
              {...register('message', {
                maxLength: {
                  value: 300,
                  message: 'Message cannot exceed 300 characters',
                },
              })}
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent transition-all resize-none ${
                errors.message ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
              }`}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.message.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base text-white bg-[#06b6d4] hover:bg-[#0891b2] shadow-lg shadow-[#06b6d4]/30 active:scale-98 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Reservation...</span>
                </>
              ) : (
                <>
                  <span>Confirm Appointment Reservation</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

            <p className="text-center text-[11px] text-slate-500 mt-3 font-medium">
              HIPAA Compliant &bull; Zero Spam &bull; No credit card required
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default BookingForm;
