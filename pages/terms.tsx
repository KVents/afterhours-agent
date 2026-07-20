import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div style={styles.wrap}>
      <div style={styles.page}>
        <a href="/" style={styles.backLink}>
          &larr; Back
        </a>
        <h1>Terms of Service</h1>
        <p style={styles.updated}>Last updated: July 2026</p>

        <p>
          These terms are issued by Krishang Patel, operator of this after-hours
          intake system ("the Service"), used by a law firm to triage calls received
          outside business hours using an AI voice agent. By calling the after-hours
          line or using the admin dashboard, you agree to these terms.
        </p>

        <h2>Nature of the Service</h2>
        <p>
          The Service is an intake and triage tool. It does not provide legal
          advice. Calling the after-hours line does not create an attorney-client
          relationship. Information collected during a call is reviewed by firm
          staff as part of the firm's normal intake process.
        </p>

        <h2>No warranty</h2>
        <p>
          The Service is provided "as is." We do not guarantee that call handling,
          SMS notifications, or data storage will be uninterrupted or error-free.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the extent permitted by law, the firm is not liable for indirect,
          incidental, or consequential damages arising from use of the Service.
        </p>

        <h2>Changes</h2>
        <p>These terms may be updated from time to time.</p>

        <h2>Contact</h2>
        <p>
          Questions can be sent to{' '}
          <a href="mailto:talk2krishang@gmail.com">talk2krishang@gmail.com</a>.
        </p>
      </div>
      <Footer />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '100vh',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  page: {
    fontFamily: 'system-ui, sans-serif',
    maxWidth: 720,
    margin: '0 auto',
    padding: '2rem 2rem 0',
    lineHeight: 1.6,
    color: '#111',
    background: '#fff',
    flex: 1,
    width: '100%',
  },
  backLink: {
    color: '#2c3e50',
    textDecoration: 'none',
    fontSize: '0.9rem',
    display: 'inline-block',
    marginBottom: '1rem',
  },
  updated: { color: '#888', fontSize: '0.9rem' },
};
