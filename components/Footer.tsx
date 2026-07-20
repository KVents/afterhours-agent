export default function Footer() {
  return (
    <footer style={styles.footer}>
      <a href="/privacy" style={styles.link}>
        Privacy Policy
      </a>
      <span style={styles.dot}>·</span>
      <a href="/terms" style={styles.link}>
        Terms of Service
      </a>
    </footer>
  );
}

const styles: Record<string, React.CSSProperties> = {
  footer: {
    maxWidth: 1200,
    margin: '3rem auto 0',
    padding: '1.25rem 2rem 2rem',
    borderTop: '1px solid #eee',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#888',
    fontFamily: 'system-ui, sans-serif',
  },
  link: { color: '#888', textDecoration: 'none' },
  dot: { color: '#ccc' },
};
