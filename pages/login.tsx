import type { GetServerSideProps } from 'next';
import { useState } from 'react';
import Footer from '../components/Footer';
import { isAuthenticated } from '../lib/auth';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (isAuthenticated(req.headers.cookie)) {
    return { redirect: { destination: '/', permanent: false } };
  }
  return { props: {} };
};

export default function Login() {
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
      window.location.href = '/';
      return;
    }

    const body = await res.json().catch(() => ({}));
    setError(body.error || 'Invalid password');
    setSubmitting(false);
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.page}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.brand}>After-Hours Intake</div>
          <h1 style={styles.title}>Sign in</h1>
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
      <Footer />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#fafafa',
  },
  page: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, sans-serif',
  },
  form: {
    background: '#fff',
    padding: '2.25rem',
    borderRadius: 10,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
    border: '1px solid #eee',
    width: 320,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  brand: {
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  title: { margin: '0 0 0.5rem', fontSize: '1.4rem' },
  label: { fontSize: '0.85rem', color: '#444' },
  input: {
    padding: '0.6rem 0.7rem',
    fontSize: '1rem',
    border: '1px solid #ddd',
    borderRadius: 6,
  },
  error: { color: '#c0392b', fontSize: '0.85rem', margin: 0 },
  button: {
    marginTop: '0.25rem',
    padding: '0.65rem',
    fontSize: '1rem',
    background: '#2c3e50',
    color: '#fff',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
};
