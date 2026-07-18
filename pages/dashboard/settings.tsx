import type { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!isAuthenticated(req.headers.cookie)) {
    return { redirect: { destination: '/dashboard/login', permanent: false } };
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
          window.location.href = '/dashboard/login';
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
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Settings</h1>
        <a href="/dashboard" style={styles.backLink}>
          &larr; Back to leads
        </a>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label} htmlFor="phone">
            After-hours alert phone number
          </label>
          <p style={styles.hint}>
            New leads text this number. Use E.164 format, e.g. +15551234567. You can
            update or remove this number here at any time.
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
        </form>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: 'system-ui, sans-serif',
    padding: '1.5rem 2rem',
    maxWidth: 600,
    margin: '0 auto',
    minHeight: '100vh',
    background: '#fff',
    color: '#111',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  title: { margin: 0 },
  backLink: { color: '#2c3e50', textDecoration: 'none', fontSize: '0.9rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  label: { fontWeight: 600 },
  hint: { color: '#666', fontSize: '0.85rem', margin: '0 0 0.5rem' },
  input: {
    padding: '0.6rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  error: { color: '#c0392b', fontSize: '0.9rem' },
  success: { color: '#27ae60', fontSize: '0.9rem' },
  button: {
    marginTop: '0.5rem',
    padding: '0.6rem 1.2rem',
    background: '#2c3e50',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
};
