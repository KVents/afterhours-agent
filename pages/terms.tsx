export default function TermsOfService() {
  return (
    <div style={styles.page}>
      <h1>Terms of Service</h1>
      <p style={styles.updated}>Last updated: July 2026</p>

      <p>
        This after-hours intake system ("the Service") is operated by a law firm to
        triage calls received outside business hours using an AI voice agent. By
        calling the after-hours line or using the admin dashboard, you agree to
        these terms.
      </p>

      <h2>Nature of the Service</h2>
      <p>
        The Service is an intake and triage tool. It does not provide legal advice.
        Calling the after-hours line does not create an attorney-client
        relationship. Information collected during a call is reviewed by firm staff
        as part of the firm's normal intake process.
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
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: 'system-ui, sans-serif',
    maxWidth: 720,
    margin: '0 auto',
    padding: '2rem',
    lineHeight: 1.6,
    color: '#111',
    background: '#fff',
  },
  updated: { color: '#666', fontSize: '0.9rem' },
};
