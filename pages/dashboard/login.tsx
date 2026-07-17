import type { GetServerSideProps } from 'next';
import { useState } from 'react';
import { isAuthenticated } from '../../lib/auth';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (isAuthenticated(req.headers.cookie)) {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }
  return { props: {} };
};

export default function DashboardLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch('/api/dashboard/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = '/dashboard';
      return;
    }

    const body = await res.json().catch(() => ({}));
    setError(body.error || 'Invalid password');
    setSubmitting(false);
  }

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <label style={styles.label} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={submitting || !password} style={styles.button}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
    background: '#f5f5f5',
  },
  form: {
    background: '#fff',
    padding: '2rem',
    borderRadius: 8,
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
    width: 320,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  title: { margin: 0, fontSize: '1.25rem' },
  label: { fontSize: '0.85rem', color: '#444' },
  input: {
    padding: '0.5rem',
    fontSize: '1rem',
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  error: { color: '#c0392b', fontSize: '0.85rem', margin: 0 },
  button: {
    padding: '0.6rem',
    fontSize: '1rem',
    background: '#2c3e50',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};
