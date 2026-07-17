import type { GetServerSideProps } from 'next';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { isAuthenticated } from '../../lib/auth';
import { FIT_DECISION_VALUES, Lead, URGENCY_VALUES } from '../../lib/types';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!isAuthenticated(req.headers.cookie)) {
    return { redirect: { destination: '/dashboard/login', permanent: false } };
  }
  return { props: {} };
};

const DEBOUNCE_MS = 300;

export default function Dashboard() {
  const [q, setQ] = useState('');
  const [practiceArea, setPracticeArea] = useState('');
  const [urgency, setUrgency] = useState('');
  const [fitDecision, setFitDecision] = useState('');

  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/practice-areas')
      .then((res) => {
        if (res.status === 401) {
          window.location.href = '/dashboard/login';
          return null;
        }
        return res.json();
      })
      .then((body) => {
        if (body) setPracticeAreas(body.practice_areas ?? []);
      })
      .catch(() => {});
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (practiceArea) params.set('practice_area', practiceArea);
    if (urgency) params.set('urgency', urgency);
    if (fitDecision) params.set('fit_decision', fitDecision);
    return params.toString();
  }, [q, practiceArea, urgency, fitDecision]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      fetch(`/api/dashboard/leads?${queryString}`)
        .then((res) => {
          if (res.status === 401) {
            window.location.href = '/dashboard/login';
            return null;
          }
          return res.json();
        })
        .then((body) => {
          if (!body) return;
          if (body.error) {
            setError(body.error);
            setLeads([]);
            setTotal(0);
          } else {
            setLeads(body.leads ?? []);
            setTotal(body.total ?? 0);
          }
        })
        .catch(() => setError('Failed to load leads'))
        .finally(() => setLoading(false));
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [queryString]);

  async function handleLogout() {
    await fetch('/api/dashboard/logout', { method: 'POST' });
    window.location.href = '/dashboard/login';
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Leads</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search name, phone, email, summary…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ ...styles.input, flex: 2, minWidth: 220 }}
        />
        <select
          value={practiceArea}
          onChange={(e) => setPracticeArea(e.target.value)}
          style={styles.input}
        >
          <option value="">All practice areas</option>
          {practiceAreas.map((pa) => (
            <option key={pa} value={pa}>
              {pa}
            </option>
          ))}
        </select>
        <select value={urgency} onChange={(e) => setUrgency(e.target.value)} style={styles.input}>
          <option value="">All urgency</option>
          {URGENCY_VALUES.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <select
          value={fitDecision}
          onChange={(e) => setFitDecision(e.target.value)}
          style={styles.input}
        >
          <option value="">All fit decisions</option>
          {FIT_DECISION_VALUES.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <a
          href={`/api/dashboard/leads/export${queryString ? `?${queryString}` : ''}`}
          style={styles.exportButton}
        >
          Export CSV
        </a>
      </div>

      {error && <p style={styles.error}>{error}</p>}
      {loading ? (
        <p>Loading…</p>
      ) : leads.length === 0 ? (
        <p>No leads match these filters.</p>
      ) : (
        <>
          <p style={styles.total}>{total} lead{total === 1 ? '' : 's'}</p>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Created</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Practice area</th>
                <th style={styles.th}>Urgency</th>
                <th style={styles.th}>Fit</th>
                <th style={styles.th}>Jurisdiction</th>
                <th style={styles.th}>Matter summary</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const expanded = expandedId === lead.id;
                return (
                  <Fragment key={lead.id}>
                    <tr
                      onClick={() => setExpandedId(expanded ? null : lead.id)}
                      style={styles.row}
                    >
                      <td style={styles.td}>{formatDate(lead.created_at)}</td>
                      <td style={styles.td}>{lead.caller_name || '—'}</td>
                      <td style={styles.td}>{lead.phone || '—'}</td>
                      <td style={styles.td}>{lead.practice_area || '—'}</td>
                      <td style={styles.td}>{lead.urgency || '—'}</td>
                      <td style={styles.td}>{lead.fit_decision || '—'}</td>
                      <td style={styles.td}>{lead.jurisdiction || '—'}</td>
                      <td style={styles.td}>{truncate(lead.matter_summary, 60)}</td>
                    </tr>
                    {expanded && (
                      <tr>
                        <td colSpan={8} style={styles.detailCell}>
                          <div style={styles.detailGrid}>
                            <DetailField label="Email" value={lead.email} />
                            <DetailField label="Disposition" value={lead.disposition} />
                            <DetailField
                              label="Conflict flag"
                              value={lead.conflict_flag ? 'Yes' : 'No'}
                            />
                            <DetailField label="Adverse party" value={lead.adverse_party} />
                            <DetailField
                              label="Fit reasons"
                              value={lead.fit_reasons?.join(', ')}
                            />
                            <DetailField
                              label="Voicemail"
                              value={lead.is_voicemail ? 'Yes' : 'No'}
                            />
                            <DetailField
                              label="Full matter summary"
                              value={lead.matter_summary}
                              wide
                            />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function DetailField({
  label,
  value,
  wide,
}: {
  label: string;
  value: string | null | undefined;
  wide?: boolean;
}) {
  return (
    <div style={wide ? { gridColumn: '1 / -1' } : undefined}>
      <div style={styles.detailLabel}>{label}</div>
      <div style={styles.detailValue}>{value || '—'}</div>
    </div>
  );
}

function truncate(value: string | null, length: number): string {
  if (!value) return '—';
  return value.length > length ? `${value.slice(0, length)}…` : value;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString();
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: 'system-ui, sans-serif',
    padding: '1.5rem 2rem',
    maxWidth: 1200,
    margin: '0 auto',
    minHeight: '100vh',
    background: '#fff',
    color: '#111',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  title: { margin: 0 },
  logoutButton: {
    padding: '0.5rem 1rem',
    background: '#eee',
    border: '1px solid #ccc',
    borderRadius: 4,
    cursor: 'pointer',
  },
  controls: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  input: {
    padding: '0.5rem',
    fontSize: '0.9rem',
    border: '1px solid #ccc',
    borderRadius: 4,
  },
  exportButton: {
    padding: '0.5rem 1rem',
    background: '#2c3e50',
    color: '#fff',
    borderRadius: 4,
    textDecoration: 'none',
    fontSize: '0.9rem',
    display: 'inline-flex',
    alignItems: 'center',
  },
  error: { color: '#c0392b' },
  total: { color: '#666', fontSize: '0.85rem' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' },
  th: {
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    padding: '0.5rem',
    background: '#fafafa',
  },
  td: { borderBottom: '1px solid #eee', padding: '0.5rem' },
  row: { cursor: 'pointer' },
  detailCell: { background: '#fafafa', padding: '1rem' },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
  },
  detailLabel: { fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' },
  detailValue: { fontSize: '0.9rem' },
};
