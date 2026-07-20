import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <div style={styles.wrap}>
      <div style={styles.page}>
        <a href="/" style={styles.backLink}>
          &larr; Back
        </a>
        <h1>Privacy Policy</h1>
        <p style={styles.updated}>Last updated: July 2026</p>

      <p>
        This policy is issued by Krishang Patel, operator of this after-hours intake
        system ("the Service"), used by a single law firm to triage calls received
        outside business hours. This policy describes what information the Service
        collects and how it is used.
      </p>

      <h2>What we collect</h2>
      <p>
        When a caller reaches the after-hours line, an AI voice agent collects: the
        caller's name, phone number, email (if provided), practice area,
        jurisdiction, a summary of their legal matter, and related intake details
        (urgency, potential conflicts, etc.). Call recordings and transcripts may
        also be retained.
      </p>

      <h2>How we use it</h2>
      <p>
        This information is stored securely and used solely to notify the firm's
        on-call attorney of the new lead (by SMS) and to let firm staff review leads
        in a password-protected admin dashboard. It is not used for marketing.
      </p>

      <h2>SMS messaging</h2>
      <p>
        Phone numbers collected through this Service are used only to send internal
        lead-notification texts to the firm's own on-call staff — not to the callers
        themselves. Mobile information and messaging consent are not shared with
        third parties or affiliates for marketing or promotional purposes. Message
        frequency is one text per new after-hours lead (not a recurring or
        promotional message stream). Message and data rates may apply. Reply STOP
        to unsubscribe at any time, or update the alert phone number directly in
        the admin settings dashboard.
      </p>

      <h2>Third-party service providers</h2>
      <p>
        We use third-party providers to operate the Service, including a
        telephony/SMS provider, a voice-AI provider, and a database provider. These
        providers process data only as needed to deliver the Service and are not
        authorized to use it for their own purposes.
      </p>

      <h2>Data retention</h2>
      <p>
        Lead records are retained for as long as needed for the firm's intake and
        recordkeeping purposes.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent to{' '}
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
