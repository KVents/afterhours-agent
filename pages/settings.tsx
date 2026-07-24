import type { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { isAuthenticated } from '../lib/auth';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!isAuthenticated(req.headers.cookie)) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  return { props: {} };
};

export default function Settings() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard/settings')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/login';
          return null;
        }
        return res.json();
      })
      .then((body) => {
        if (body?.lawyer_phone) setPhone(body.lawyer_phone);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const res = await fetch('/api/dashboard/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lawyer_phone: phone }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Failed to save');
    }
    setSaving(false);
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>Settings</h1>
          <a href="/" style={styles.backLink}>
            &larr; Back to leads
          </a>
        </div>

        {loading ? (
          <p style={styles.muted}>Loading…</p>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label} htmlFor="phone">
              After-hours alert phone number
            </label>
            <p style={styles.hint}>
              New leads text this number. Use E.164 format, e.g. +15551234567. You
              can update or remove this number here at any time.
            </p>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+15551234567"
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            {success && <p style={styles.success}>Saved.</p>}
            <button type="submit" disabled={saving} style={styles.button}>
              {saving ? 'Saving…' : 'Save'}
            </button>

            <div style={styles.consentBox}>
              <p style={styles.consentText}>
                <strong>Consent to receive SMS alerts.</strong> This number belongs
                to you, the account administrator for this after-hours intake
                system — you are the sole recipient of these messages. By entering
                your number and clicking Save, you consent to receive automated
                after-hours lead-alert text messages from this system at that
                number. Message frequency varies with call volume (typically a
                few messages per week). Message and data rates may apply. Reply
                STOP to unsubscribe at any time, or remove your number on this
                page. See our{' '}
                <a href="/privacy" style={styles.consentLink}>
                  Privacy Policy
                </a>{' '}
                and{' '}
                <a href="/terms" style={styles.consentLink}>
                  Terms of Service
                </a>
                .
              </p>
            </div>
          </form>
        )}
      </div>
      <Footer />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100vh',
    background: '#fff',
    color: '#111',
    display: 'flex',
    flexDirection: 'column',
  },
  page: {
    fontFamily: 'system-ui, sans-serif',
    padding: '2rem 2rem 0',
    maxWidth: 600,
    margin: '0 auto',
    width: '100%',
    flex: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: { margin: 0, letterSpacing: '-0.02em' },
  backLink: { color: '#2c3e50', textDecoration: 'none', fontSize: '0.9rem' },
  muted: { color: '#888' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: 600 },
  hint: { color: '#888', fontSize: '0.85rem', margin: '0 0 0.5rem' },
  input: {
    padding: '0.6rem 0.7rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: 6,
  },
  error: { color: '#c0392b', fontSize: '0.9rem' },
  success: { color: '#27ae60', fontSize: '0.9rem' },
  button: {
    marginTop: '0.5rem',
    padding: '0.6rem 1.2rem',
    background: '#2c3e50',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  consentBox: {
    marginTop: '1.5rem',
    padding: '1rem',
    background: '#fafafa',
    border: '1px solid #eee',
    borderRadius: 8,
  },
  consentText: { fontSize: '0.8rem', color: '#666', lineHeight: 1.6, margin: 0 },
  consentLink: { color: '#2c3e50' },
};
