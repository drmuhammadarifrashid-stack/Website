'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import Link from 'next/link';
import { WhatsAppButton } from '@/components/ui/WhatsAppButton';
import { getAppointmentRequestMessage } from '@/lib/whatsapp';
import {
  appointmentSchema,
  AppointmentFormValues,
  LOCATIONS,
  GENDERS,
  TIME_SLOTS,
  TIME_SLOT_LABELS,
} from '@/lib/appointmentSchema';

// ─── Types ────────────────────────────────────────────────────
type Step = 1 | 2 | 3;
type SubmitState = 'idle' | 'loading' | 'success' | 'error';

interface SuccessData {
  name: string;
  phone: string;
  location: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
}

// ─── Helper Components ────────────────────────────────────────
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span
      role="alert"
      style={{
        display: 'block',
        color: 'var(--color-danger)',
        fontSize: '0.78rem',
        marginTop: '0.3rem',
        fontWeight: 500,
      }}
    >
      {message}
    </span>
  );
}

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label
      style={{
        display: 'block',
        fontWeight: 600,
        fontSize: '0.875rem',
        color: 'var(--color-gray-700)',
        marginBottom: '0.4rem',
      }}
    >
      {children}
      {required && <span style={{ color: 'var(--color-danger)', marginLeft: 2 }}>*</span>}
    </label>
  );
}

// ─── Step Indicator ───────────────────────────────────────────
const STEPS = ['Personal Info', 'Appointment', 'Review'] as const;

function StepIndicator({ current }: { current: Step }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2.5rem',
        gap: 0,
      }}
    >
      {STEPS.map((label, i) => {
        const num = (i + 1) as Step;
        const active = current === num;
        const done = current > num;
        return (
          <div key={label} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
              <div
                aria-current={active ? 'step' : undefined}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: done
                    ? 'var(--color-success)'
                    : active
                    ? 'var(--color-navy)'
                    : 'var(--color-gray-200)',
                  color: done || active ? 'white' : 'var(--color-gray-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxShadow: active ? '0 0 0 4px rgba(10,35,66,0.15)' : 'none',
                }}
              >
                {done ? '✓' : num}
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  color: active ? 'var(--color-navy)' : 'var(--color-gray-400)',
                  fontWeight: active ? 700 : 400,
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: current > num ? 'var(--color-success)' : 'var(--color-gray-200)',
                  margin: '0 0.5rem',
                  marginBottom: '1.25rem',
                  transition: 'background 0.3s ease',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────
function SuccessScreen({ data }: { data: SuccessData }) {
  const waMsg = getAppointmentRequestMessage({
    name: data.name,
    phone: data.phone,
    date: data.appointmentDate
  });

  return (
    <div
      className="card"
      style={{
        maxWidth: 560,
        width: '100%',
        padding: '3rem 2.5rem',
        textAlign: 'center',
        margin: '0 auto',
        animation: 'fadeInUp 0.5s ease',
      }}
    >
      {/* Animated checkmark */}
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.75rem',
          margin: '0 auto 1.5rem',
          boxShadow: '0 8px 24px rgba(5,150,105,0.2)',
        }}
      >
        ✅
      </div>

      <h2
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--color-navy)',
          marginBottom: '0.75rem',
        }}
      >
        Appointment Requested!
      </h2>
      <p style={{ color: 'var(--color-gray-500)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
        Thank you <strong style={{ color: 'var(--color-navy)' }}>{data.name}</strong>! Our team
        will contact you at <strong style={{ color: 'var(--color-navy)' }}>{data.phone}</strong>{' '}
        within 24 hours to confirm your appointment.
      </p>

      {/* Booking Summary */}
      <div
        style={{
          background: 'var(--color-off-white)',
          borderRadius: 14,
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          textAlign: 'left',
          border: '1px solid var(--color-gray-100)',
        }}
      >
        {[
          ['📍 Location', data.location],
          ['📅 Date', data.appointmentDate],
          ['🕐 Time', TIME_SLOT_LABELS[data.appointmentTime] ?? data.appointmentTime],
          ['📋 Reason', data.reason.length > 60 ? data.reason.slice(0, 60) + '…' : data.reason],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '1rem',
              padding: '0.5rem 0',
              borderBottom: '1px solid var(--color-gray-100)',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', flexShrink: 0 }}>
              {label}
            </span>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--color-navy)',
                textAlign: 'right',
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <WhatsAppButton message={waMsg}>
          💬 Confirm via WhatsApp
        </WhatsAppButton>
        <Link href="/" className="btn btn-secondary">
          ← Back to Home
        </Link>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────
export function AppointmentForm() {
  const [step, setStep] = useState<Step>(1);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [serverError, setServerError] = useState('');
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      phone: '',
      age: undefined,
      gender: undefined,
      location: undefined,
      appointmentDate: '',
      appointmentTime: undefined,
      reason: '',
    },
  });

  // ── Step field mapping ─────────────────────────────────────
  const STEP_FIELDS: Record<Step, (keyof AppointmentFormValues)[]> = {
    1: ['name', 'phone', 'age', 'gender'],
    2: ['location', 'appointmentDate', 'appointmentTime', 'reason'],
    3: [],
  };

  const nextStep = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => (s + 1) as Step);
  };

  const prevStep = () => setStep((s) => (s - 1) as Step);

  // ── Submit ─────────────────────────────────────────────────
  const onSubmit = async (data: AppointmentFormValues) => {
    setSubmitState('loading');
    setServerError('');
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setSuccessData({
          name: data.name,
          phone: data.phone,
          location: data.location,
          appointmentDate: data.appointmentDate,
          appointmentTime: data.appointmentTime,
          reason: data.reason,
        });
        setSubmitState('success');
      } else {
        const msg =
          json.error ||
          (json.details
            ? Object.values(json.details as Record<string, string[]>)
                .flat()
                .join(', ')
            : 'Failed to book appointment. Please try again.');
        setServerError(msg);
        setSubmitState('error');
      }
    } catch {
      setServerError('Network error. Please check your connection and try again.');
      setSubmitState('error');
    }
  };

  // ── Input styles ───────────────────────────────────────────
  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '0.7rem 1rem',
    border: `1.5px solid ${hasError ? 'var(--color-danger)' : 'var(--color-gray-200)'}`,
    borderRadius: 'var(--radius-md)',
    fontSize: '0.925rem',
    color: 'var(--color-gray-800)',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    fontFamily: 'Inter, sans-serif',
  });

  const today = new Date().toISOString().split('T')[0];
  const values = getValues();

  // ── Success ────────────────────────────────────────────────
  if (submitState === 'success' && successData) {
    return <SuccessScreen data={successData} />;
  }

  return (
    <div style={{ maxWidth: 740, margin: '0 auto' }}>
      <StepIndicator current={step} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div
          className="card"
          style={{ padding: '2.5rem', animation: 'fadeInUp 0.3s ease' }}
        >
          {/* ──────── STEP 1: Personal Info ──────── */}
          {step === 1 && (
            <div>
              <h2
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-navy)',
                  marginBottom: '0.4rem',
                }}
              >
                Personal Information
              </h2>
              <p
                style={{
                  color: 'var(--color-gray-500)',
                  fontSize: '0.875rem',
                  marginBottom: '1.75rem',
                }}
              >
                Your details are kept strictly confidential.
              </p>

              {/* Name */}
              <div style={{ marginBottom: '1.25rem' }}>
                <Label required>Full Name</Label>
                <input
                  id="name"
                  type="text"
                  placeholder="e.g. Ahmed Khan"
                  autoComplete="name"
                  style={inputStyle(!!errors.name)}
                  {...register('name')}
                />
                <FieldError message={errors.name?.message} />
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '1.25rem' }}>
                <Label required>Phone Number</Label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="03001234567 or +923001234567"
                  autoComplete="tel"
                  style={inputStyle(!!errors.phone)}
                  {...register('phone')}
                />
                <FieldError message={errors.phone?.message} />
              </div>

              {/* Age + Gender */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                }}
                className="form-grid"
              >
                <div>
                  <Label required>Age</Label>
                  <input
                    id="age"
                    type="number"
                    placeholder="e.g. 35"
                    min={0}
                    max={120}
                    style={inputStyle(!!errors.age)}
                    {...register('age', { valueAsNumber: true })}
                  />
                  <FieldError message={errors.age?.message} />
                </div>
                <div>
                  <Label required>Gender</Label>
                  <select
                    id="gender"
                    style={inputStyle(!!errors.gender)}
                    {...register('gender')}
                  >
                    <option value="">Select gender...</option>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.gender?.message} />
                </div>
              </div>
            </div>
          )}

          {/* ──────── STEP 2: Appointment Details ──────── */}
          {step === 2 && (
            <div>
              <h2
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-navy)',
                  marginBottom: '0.4rem',
                }}
              >
                Appointment Details
              </h2>
              <p
                style={{
                  color: 'var(--color-gray-500)',
                  fontSize: '0.875rem',
                  marginBottom: '1.75rem',
                }}
              >
                Choose your preferred location, date and time.
              </p>

              {/* Location */}
              <div style={{ marginBottom: '1.25rem' }}>
                <Label required>Clinic / Hospital Location</Label>
                <select
                  id="location"
                  style={inputStyle(!!errors.location)}
                  {...register('location')}
                >
                  <option value="">Select a location...</option>
                  {LOCATIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.location?.message} />
              </div>

              {/* Date + Time */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.25rem',
                }}
                className="form-grid"
              >
                <div>
                  <Label required>Preferred Date</Label>
                  <input
                    id="appointmentDate"
                    type="date"
                    min={today}
                    style={inputStyle(!!errors.appointmentDate)}
                    {...register('appointmentDate')}
                  />
                  <FieldError message={errors.appointmentDate?.message} />
                </div>
                <div>
                  <Label required>Preferred Time</Label>
                  <select
                    id="appointmentTime"
                    style={inputStyle(!!errors.appointmentTime)}
                    {...register('appointmentTime')}
                  >
                    <option value="">Select time...</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {TIME_SLOT_LABELS[t]}
                      </option>
                    ))}
                  </select>
                  <FieldError message={errors.appointmentTime?.message} />
                </div>
              </div>

              {/* Reason */}
              <div>
                <Label required>Reason for Visit</Label>
                <textarea
                  id="reason"
                  rows={4}
                  placeholder="Describe your pain condition, symptoms, or reason for consultation..."
                  style={{
                    ...inputStyle(!!errors.reason),
                    resize: 'vertical',
                    minHeight: 110,
                  }}
                  {...register('reason')}
                />
                <FieldError message={errors.reason?.message} />
              </div>
            </div>
          )}

          {/* ──────── STEP 3: Review ──────── */}
          {step === 3 && (
            <div>
              <h2
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--color-navy)',
                  marginBottom: '0.4rem',
                }}
              >
                Review & Submit
              </h2>
              <p
                style={{
                  color: 'var(--color-gray-500)',
                  fontSize: '0.875rem',
                  marginBottom: '1.75rem',
                }}
              >
                Please confirm all details before submitting.
              </p>

              {/* Summary card */}
              <div
                style={{
                  background: 'var(--color-off-white)',
                  borderRadius: 16,
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                  border: '1px solid var(--color-gray-100)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1rem',
                  }}
                  className="form-grid"
                >
                  {[
                    ['👤 Name', values.name],
                    ['📱 Phone', values.phone],
                    ['🎂 Age', values.age],
                    ['⚧ Gender', values.gender],
                    ['📍 Location', values.location],
                    ['📅 Date', values.appointmentDate],
                    [
                      '🕐 Time',
                      TIME_SLOT_LABELS[values.appointmentTime as string] ??
                        values.appointmentTime,
                    ],
                  ].map(([label, value]) => (
                    <div key={String(label)}>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--color-gray-400)',
                          marginBottom: 3,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontWeight: 600,
                          color: 'var(--color-navy)',
                          fontSize: '0.9rem',
                        }}
                      >
                        {String(value) || '—'}
                      </div>
                    </div>
                  ))}
                </div>
                {values.reason && (
                  <div
                    style={{
                      marginTop: '1rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--color-gray-200)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--color-gray-400)',
                        marginBottom: 4,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      📋 Reason
                    </div>
                    <div
                      style={{
                        color: 'var(--color-gray-700)',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                      }}
                    >
                      {values.reason}
                    </div>
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div
                style={{
                  background: '#fff7ed',
                  border: '1.5px solid #fed7aa',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                  marginBottom: '1.25rem',
                  fontSize: '0.82rem',
                  color: '#92400e',
                  lineHeight: 1.65,
                }}
              >
                <strong>⚠️ Please Note:</strong> This is an appointment{' '}
                <em>request</em>, not a confirmed booking. Our team will call
                you within 24 hours to confirm. All consultations are{' '}
                <strong>in-person only</strong>. For medical emergencies call{' '}
                <strong>1122</strong>.
              </div>

              {/* Server error */}
              {submitState === 'error' && serverError && (
                <div
                  role="alert"
                  style={{
                    background: '#fee2e2',
                    border: '1px solid #fca5a5',
                    borderRadius: 12,
                    padding: '0.875rem 1.125rem',
                    marginBottom: '1rem',
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  ❌ {serverError}
                </div>
              )}
            </div>
          )}

          {/* ──────── Navigation ──────── */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '2rem',
              gap: '1rem',
            }}
          >
            {step > 1 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
                disabled={submitState === 'loading'}
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                id={`step-${step}-next`}
                className="btn btn-primary"
                onClick={nextStep}
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                id="submit-appointment"
                className="btn btn-teal btn-lg"
                disabled={submitState === 'loading'}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  position: 'relative',
                  minWidth: 220,
                  justifyContent: 'center',
                }}
              >
                {submitState === 'loading' ? (
                  <>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 16,
                        height: 16,
                        border: '2.5px solid rgba(255,255,255,0.4)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                      }}
                    />
                    Submitting…
                  </>
                ) : (
                  '✅ Submit Appointment'
                )}
              </button>
            )}
          </div>
        </div>
      </form>

      {/* WhatsApp alternative */}
      <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
        <p
          style={{
            color: 'var(--color-gray-500)',
            fontSize: '0.875rem',
            marginBottom: '0.75rem',
          }}
        >
          Prefer a quicker way?
        </p>
        <WhatsAppButton message={getAppointmentRequestMessage()}>
          💬 Book via WhatsApp Instead
        </WhatsAppButton>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
