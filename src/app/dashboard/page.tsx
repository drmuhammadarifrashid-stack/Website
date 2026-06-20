'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Appointment {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  location: string;
  appointmentDate: string;
  appointmentTime: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled_requested';
  rescheduleNote?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Reschedule modal state
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [rescheduleNote, setRescheduleNote] = useState('');
  const [submittingReschedule, setSubmittingReschedule] = useState(false);

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/appointments/my');
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      } else {
        setError(data.error || 'Failed to load appointments');
      }
    } catch {
      setError('An error occurred while fetching appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      if (session?.user?.role === 'admin') {
        router.push('/admin');
      } else {
        fetchAppointments();
      }
    }
  }, [status, router, fetchAppointments, session]);

  const handleCancel = async (id: string) => {
    const appointment = appointments.find((a) => a.id === id);
    if (!appointment) return;

    // Enforce 24h cancellation window in UI (optional warning but we enforce it here)
    const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime || '09:00'}`);
    const now = new Date();
    const diffMs = appointmentDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      if (!confirm('This appointment is in less than 24 hours. Cancel anyway?')) {
        return;
      }
    } else {
      if (!confirm('Are you sure you want to cancel this appointment?')) {
        return;
      }
    }

    try {
      const res = await fetch(`/api/appointments/my?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Appointment cancelled successfully.');
        fetchAppointments();
      } else {
        alert(data.error || 'Failed to cancel appointment');
      }
    } catch {
      alert('An error occurred. Please try again.');
    }
  };

  const handleRescheduleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointmentId) return;

    try {
      setSubmittingReschedule(true);
      const res = await fetch('/api/appointments/my', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: selectedAppointmentId,
          note: rescheduleNote,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert('Reschedule request sent. The clinic will review your request.');
        setIsRescheduleModalOpen(false);
        setSelectedAppointmentId(null);
        setRescheduleNote('');
        fetchAppointments();
      } else {
        alert(data.error || 'Failed to request reschedule');
      }
    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setSubmittingReschedule(false);
    }
  };

  const openRescheduleModal = (id: string) => {
    setSelectedAppointmentId(id);
    setIsRescheduleModalOpen(true);
  };

  if (status === 'loading') {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: '1rem' }}>Loading dashboard...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div style={styles.pageWrapper}>
      {/* Background decoration */}
      <div style={styles.bgBlob1} />
      <div style={styles.bgBlob2} />

      <div style={styles.contentContainer}>
        {/* Header Block */}
        <header style={styles.header}>
          <div>
            <span style={styles.badge}>PATIENT PORTAL</span>
            <h1 style={styles.title}>Hello, {session.user.name || 'Patient'}</h1>
            <p style={styles.subtitle}>Manage your clinical appointments and scheduling requests</p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })} style={styles.logoutBtn}>
            Logout 🚪
          </button>
        </header>

        {/* Info Cards / Stats */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>📅</span>
            <div>
              <p style={styles.statLabel}>Total Bookings</p>
              <h3 style={styles.statVal}>{appointments.length}</h3>
            </div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🔔</span>
            <div>
              <p style={styles.statLabel}>Upcoming Confirmed</p>
              <h3 style={styles.statVal}>
                {appointments.filter((a) => a.status === 'confirmed').length}
              </h3>
            </div>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statIcon}>🏥</span>
            <div>
              <p style={styles.statLabel}>Quick Actions</p>
              <Link href="/appointment" style={styles.bookMoreLink}>
                Book New Appointment +
              </Link>
            </div>
          </div>
        </div>

        {/* Appointment List Section */}
        <div style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>My Appointment History</h2>

          {loading ? (
            <div style={styles.innerLoading}>
              <div style={styles.spinner}></div>
            </div>
          ) : error ? (
            <div style={styles.errorAlert}>⚠️ {error}</div>
          ) : appointments.length === 0 ? (
            <div style={styles.emptyState}>
              <span style={{ fontSize: '3rem' }}>📅</span>
              <h3 style={{ margin: '1rem 0 0.5rem', color: 'white' }}>No appointments yet</h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '320px', margin: '0 auto 1.5rem' }}>
                You have not booked any appointments with Dr. Muhammad Arif Rashid.
              </p>
              <Link href="/appointment" style={styles.primaryActionBtn}>
                Book Your First Appointment
              </Link>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date & Time</th>
                    <th style={styles.th}>Location</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => {
                    const statusStyle = getStatusBadgeStyle(appt.status);
                    const canCancel = appt.status === 'pending' || appt.status === 'confirmed';
                    const canReschedule = appt.status === 'pending' || appt.status === 'confirmed';

                    return (
                      <tr key={appt.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: 600, color: 'white' }}>
                            {formatDate(appt.appointmentDate)}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.2rem' }}>
                            ⏰ {formatTime(appt.appointmentTime)}
                          </div>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.locationBadge}>{appt.location}</span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.reasonText}>{appt.reason}</div>
                        </td>
                        <td style={styles.td}>
                          <span style={{ ...styles.statusBadge, ...statusStyle }}>
                            {appt.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {appt.status === 'rescheduled_requested' && appt.rescheduleNote && (
                            <div style={styles.rescheduleNoteText}>
                              Note: &quot;{appt.rescheduleNote}&quot;
                            </div>
                          )}
                        </td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {canReschedule && (
                              <button
                                onClick={() => openRescheduleModal(appt.id)}
                                style={styles.rescheduleActionBtn}
                              >
                                Reschedule
                              </button>
                            )}
                            {canCancel && (
                              <button
                                onClick={() => handleCancel(appt.id)}
                                style={styles.cancelActionBtn}
                              >
                                Cancel
                              </button>
                            )}
                            {!canCancel && !canReschedule && (
                              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
                                No actions available
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Request Reschedule</h3>
              <button
                onClick={() => {
                  setIsRescheduleModalOpen(false);
                  setSelectedAppointmentId(null);
                  setRescheduleNote('');
                }}
                style={styles.closeModalBtn}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleRescheduleRequestSubmit}>
              <p style={styles.modalHint}>
                Please state why you want to reschedule and your preferred dates or times. Dr. Arif&apos;s clinic will review and update your schedule.
              </p>
              <textarea
                value={rescheduleNote}
                onChange={(e) => setRescheduleNote(e.target.value)}
                required
                placeholder="e.g., I would like to request to move this to next Friday morning if possible."
                rows={4}
                style={styles.modalTextarea}
              />
              <div style={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => {
                    setIsRescheduleModalOpen(false);
                    setSelectedAppointmentId(null);
                    setRescheduleNote('');
                  }}
                  style={styles.modalCancelBtn}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReschedule}
                  style={styles.modalSubmitBtn}
                >
                  {submittingReschedule ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
function formatDate(dateStr: string) {
  try {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  } catch {
    return dateStr;
  }
}

function formatTime(timeStr: string) {
  if (!timeStr) return 'N/A';
  try {
    // Expecting HH:MM
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  } catch {
    return timeStr;
  }
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'confirmed':
      return { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' };
    case 'completed':
      return { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' };
    case 'cancelled':
      return { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' };
    case 'rescheduled_requested':
      return { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' };
    case 'pending':
    default:
      return { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)' };
  }
}

const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 60%, var(--color-navy-light) 100%)',
    position: 'relative',
    overflow: 'hidden',
    padding: '6rem 1.5rem 2.5rem',
    fontFamily: 'Inter, sans-serif',
  },
  bgBlob1: {
    position: 'absolute',
    top: '-10%',
    right: '-10%',
    width: '600px',
    height: '600px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(26,122,138,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  bgBlob2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-10%',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(26,122,138,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  contentContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  badge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 700,
    background: 'rgba(26,122,138,0.2)',
    color: 'var(--color-teal-light)',
    padding: '0.25rem 0.75rem',
    borderRadius: '100px',
    marginBottom: '0.75rem',
    letterSpacing: '0.05em',
  },
  title: {
    fontFamily: 'Outfit, sans-serif',
    fontSize: '2.25rem',
    fontWeight: 800,
    color: 'white',
    margin: 0,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '1rem',
    marginTop: '0.25rem',
  },
  logoutBtn: {
    padding: '0.6rem 1.2rem',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 'var(--radius-md)',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--radius-lg)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  },
  statIcon: {
    fontSize: '2rem',
    background: 'rgba(255,255,255,0.06)',
    width: '50px',
    height: '50px',
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '0.85rem',
    fontWeight: 500,
    margin: 0,
  },
  statVal: {
    color: 'white',
    fontSize: '1.75rem',
    fontWeight: 800,
    margin: '0.25rem 0 0 0',
  },
  bookMoreLink: {
    display: 'inline-block',
    marginTop: '0.35rem',
    color: 'var(--color-teal-light)',
    fontSize: '0.9rem',
    fontWeight: 700,
    textDecoration: 'none',
  },
  sectionCard: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 'var(--radius-xl)',
    padding: '2rem',
    boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
  },
  sectionTitle: {
    fontFamily: 'Outfit, sans-serif',
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 700,
    margin: '0 0 1.5rem 0',
  },
  innerLoading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem 0',
  },
  errorAlert: {
    background: 'rgba(220,38,38,0.12)',
    border: '1px solid rgba(220,38,38,0.3)',
    borderRadius: 'var(--radius-md)',
    padding: '1rem',
    color: '#fca5a5',
    textAlign: 'center',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  primaryActionBtn: {
    display: 'inline-block',
    padding: '0.8rem 1.8rem',
    background: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-light) 100%)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: 'white',
    fontSize: '0.95rem',
    fontWeight: 700,
    textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(26,122,138,0.4)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  td: {
    padding: '1.25rem 1rem',
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    verticalAlign: 'middle',
  },
  locationBadge: {
    display: 'inline-block',
    fontSize: '0.8rem',
    background: 'rgba(255,255,255,0.06)',
    color: 'white',
    padding: '0.2rem 0.6rem',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  reasonText: {
    maxWidth: '220px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusBadge: {
    display: 'inline-block',
    fontSize: '0.75rem',
    fontWeight: 700,
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    letterSpacing: '0.02em',
  },
  rescheduleNoteText: {
    fontSize: '0.75rem',
    color: 'rgba(255,255,255,0.4)',
    fontStyle: 'italic',
    marginTop: '0.35rem',
  },
  rescheduleActionBtn: {
    padding: '0.4rem 0.8rem',
    background: 'rgba(26,122,138,0.15)',
    border: '1px solid rgba(26,122,138,0.3)',
    borderRadius: '4px',
    color: 'var(--color-teal-light)',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  cancelActionBtn: {
    padding: '0.4rem 0.8rem',
    background: 'rgba(220,38,38,0.1)',
    border: '1px solid rgba(220,38,38,0.25)',
    borderRadius: '4px',
    color: '#f87171',
    fontSize: '0.8rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  loadingContainer: {
    minHeight: '100vh',
    background: 'var(--color-navy)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.1)',
    borderTop: '4px solid var(--color-teal-light)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(8,16,28,0.85)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1.5rem',
  },
  modalContent: {
    background: 'var(--color-navy)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.25rem',
  },
  modalTitle: {
    fontFamily: 'Outfit, sans-serif',
    color: 'white',
    fontSize: '1.25rem',
    fontWeight: 700,
    margin: 0,
  },
  closeModalBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '1.25rem',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  modalHint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    marginBottom: '1rem',
  },
  modalTextarea: {
    width: '100%',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 'var(--radius-md)',
    color: 'white',
    padding: '0.75rem',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    resize: 'vertical',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    marginTop: '1.5rem',
  },
  modalCancelBtn: {
    padding: '0.6rem 1.2rem',
    background: 'none',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 'var(--radius-md)',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
  },
  modalSubmitBtn: {
    padding: '0.6rem 1.2rem',
    background: 'linear-gradient(135deg, var(--color-teal) 0%, var(--color-teal-light) 100%)',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(26,122,138,0.3)',
  },
};
