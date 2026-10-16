import React, { useState, useEffect } from 'react';
import { getHistory } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

/**
 * Step 5 / Standalone Tab: History of past resume analyses and interviews
 */
export default function HistoryStep({ onStartNewPractice, onViewSessionDetails }) {
  const [historyData, setHistoryData] = useState({ sessions: [], resumes: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getHistory();
      setHistoryData({
        sessions: data.sessions || [],
        resumes: data.resumes || [],
      });
    } catch (err) {
      setError(err.message || 'Failed to load history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (isoStr) => {
    if (!isoStr) return 'N/A';
    const date = new Date(isoStr);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColorClass = (score) => {
    if (score == null) return 'var(--text-muted)';
    if (score >= 85) return 'var(--score-excellent)';
    if (score >= 70) return 'var(--score-good)';
    if (score >= 50) return 'var(--score-fair)';
    return 'var(--score-poor)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header bar */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Session History</h2>
          <p style={{ fontSize: '0.95rem' }}>
            All your past resume reviews and interview performance records stored in MongoDB.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={fetchHistory} disabled={isLoading}>
            🔄 Refresh
          </button>
          <button className="btn btn-primary" onClick={onStartNewPractice}>
            ➕ New Practice
          </button>
        </div>
      </div>

      <ErrorMessage message={error} onDismiss={() => setError(null)} onRetry={fetchHistory} />

      {isLoading ? (
        <LoadingSpinner title="Loading History..." subtitle="Retrieving saved sessions from MongoDB." />
      ) : historyData.sessions.length === 0 && historyData.resumes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📂</span>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '8px' }}>No Sessions Yet</h3>
          <p style={{ maxWidth: '440px', margin: '0 auto 24px', fontSize: '0.95rem' }}>
            Upload your first PDF resume to see your analysis scores and practice interview questions here!
          </p>
          <button className="btn btn-primary btn-lg" onClick={onStartNewPractice}>
            Start Your First Practice Session
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  borderBottom: '1px solid var(--border-subtle)',
                }}
              >
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>DATE</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>RESUME</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>RESUME SCORE</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>INTERVIEW SCORE</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>STATUS</th>
                <th style={{ padding: '16px 20px', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {historyData.sessions.map((item, index) => (
                <tr
                  key={item.interviewId || index}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {formatDate(item.date)}
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📄</span>
                      <span>{item.fileName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        color: getScoreColorClass(item.resumeScore),
                      }}
                    >
                      {item.resumeScore != null ? `${item.resumeScore}/100` : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '1.05rem',
                        color: getScoreColorClass(item.interviewScore),
                      }}
                    >
                      {item.status === 'completed'
                        ? `${item.interviewScore}/100`
                        : 'In Progress'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      className={`badge ${
                        item.status === 'completed' ? 'badge-emerald' : 'badge-amber'
                      }`}
                    >
                      {item.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                      onClick={() => setSelectedSession(item)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}

              {/* Also list resumes that do not yet have an interview session */}
              {historyData.resumes
                .filter(
                  (res) =>
                    !historyData.sessions.some(
                      (sess) => String(sess.resumeId) === String(res._id)
                    )
                )
                .map((res) => (
                  <tr
                    key={res._id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '16px 20px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {formatDate(res.createdAt)}
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📄</span>
                        <span>{res.fileName}</span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '1.05rem',
                          color: getScoreColorClass(res.scores?.overall),
                        }}
                      >
                        {res.scores?.overall != null ? `${res.scores.overall}/100` : '—'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--text-muted)' }}>
                      Not Started
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span className="badge badge-indigo">Scored</span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                        onClick={() =>
                          onViewSessionDetails({
                            fileName: res.fileName,
                            scores: res.scores,
                            strengths: res.strengths,
                            weaknesses: res.weaknesses,
                            suggestions: res.suggestions,
                            resumeId: res._id,
                          })
                        }
                      >
                        View Score
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing detailed past session */}
      {selectedSession && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setSelectedSession(null)}
        >
          <div
            className="card"
            style={{
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '12px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.4rem' }}>{selectedSession.fileName}</h3>
                <p style={{ fontSize: '0.85rem' }}>
                  Session Date: {formatDate(selectedSession.date)}
                </p>
              </div>
              <button
                className="btn btn-outline"
                style={{ padding: '6px 12px' }}
                onClick={() => setSelectedSession(null)}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '20px',
                marginBottom: '20px',
                background: 'rgba(15, 23, 42, 0.7)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Resume Score</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: getScoreColorClass(selectedSession.resumeScore) }}>
                  {selectedSession.resumeScore ?? '—'}/100
                </div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '20px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interview Score</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: getScoreColorClass(selectedSession.interviewScore) }}>
                  {selectedSession.interviewScore ?? '—'}/100
                </div>
              </div>
            </div>

            {selectedSession.overallSummary && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.95rem', color: 'var(--accent-secondary)', marginBottom: '4px' }}>
                  Summary
                </h4>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {selectedSession.overallSummary}
                </p>
              </div>
            )}

            {selectedSession.answers && selectedSession.answers.length > 0 && (
              <div>
                <h4 style={{ fontSize: '1.05rem', marginBottom: '12px' }}>
                  Question Evaluations ({selectedSession.answers.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedSession.answers.map((ans, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 16px',
                        background: 'rgba(15, 23, 42, 0.5)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                          Q{idx + 1}: {ans.question}
                        </span>
                        <span style={{ fontWeight: 700, color: getScoreColorClass((ans.score || 0) * 10) }}>
                          {ans.score}/10
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                        Answer: {ans.userAnswer || '[Skipped]'}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: '#a5b4fc' }}>
                        Feedback: {ans.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
