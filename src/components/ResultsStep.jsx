import React, { useState } from 'react';

/**
 * Score badge helper for 0-10 per-question score
 */
function getQuestionScoreBadge(score) {
  if (score >= 8) return { label: `${score}/10 Excellent`, cls: 'badge-emerald' };
  if (score >= 6) return { label: `${score}/10 Good`, cls: 'badge-indigo' };
  if (score >= 4) return { label: `${score}/10 Fair`, cls: 'badge-amber' };
  return { label: `${score}/10 Needs Work`, cls: 'badge-rose' };
}

/**
 * Step 4: Final Interview Evaluation Results
 */
export default function ResultsStep({
  resultsData,
  onRetakeInterview,
  onNewResume,
  onGoToHistory,
}) {
  const [expandedId, setExpandedId] = useState(null);

  if (!resultsData) return null;

  const { finalScore = 0, overallSummary = '', answers = [] } = resultsData;

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Color classes for overall final score (0-100)
  let scoreClass = 'poor';
  let scoreRating = 'Needs Practice';
  if (finalScore >= 85) {
    scoreClass = 'excellent';
    scoreRating = 'Job-Ready / Excellent';
  } else if (finalScore >= 70) {
    scoreClass = 'good';
    scoreRating = 'Solid Performer';
  } else if (finalScore >= 50) {
    scoreClass = 'fair';
    scoreRating = 'Fair / Average';
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Card with Overall Interview Score */}
      <div className="card">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px',
          }}
        >
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>
              Interview Complete
            </span>
            <h2 style={{ fontSize: '1.85rem', marginBottom: '8px' }}>
              Interview Evaluation Results
            </h2>
            <p style={{ maxWidth: '580px', fontSize: '1rem', color: 'var(--text-secondary)' }}>
              {overallSummary}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: `var(--score-${scoreClass})` }}>
                {scoreRating}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Final Interview Score
              </div>
            </div>
            <div className={`score-badge lg ${scoreClass}`}>
              {finalScore}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-outline" onClick={onNewResume}>
              📄 Upload New Resume
            </button>
            <button className="btn btn-secondary" onClick={onGoToHistory}>
              📜 View Past History
            </button>
          </div>

          <button className="btn btn-primary" onClick={onRetakeInterview}>
            🔄 Practice Again
          </button>
        </div>
      </div>

      {/* Detailed Question Review List */}
      <div>
        <h3 style={{ fontSize: '1.35rem', marginBottom: '16px' }}>
          Detailed Question-by-Question Feedback ({answers.length} Questions)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {answers.map((item, index) => {
            const badgeInfo = getQuestionScoreBadge(item.score ?? 0);
            const isExpanded = expandedId === item.questionId || expandedId === null; // Expanded by default or toggled

            return (
              <div
                key={item.questionId || index}
                className="card"
                style={{
                  padding: '20px 24px',
                  background: 'var(--bg-secondary)',
                }}
              >
                {/* Header Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '16px',
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleExpand(item.questionId)}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                        Q{index + 1}
                      </span>
                      <span className={`badge ${badgeInfo.cls}`}>
                        {badgeInfo.label}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {item.question}
                    </h4>
                  </div>

                  <button
                    className="btn btn-outline"
                    style={{ padding: '4px 10px', fontSize: '0.8rem', border: 'none' }}
                  >
                    {isExpanded ? '▲ Hide' : '▼ Details'}
                  </button>
                </div>

                {/* Collapsible Details */}
                {isExpanded && (
                  <div
                    style={{
                      marginTop: '20px',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    {/* Candidate's Answer */}
                    <div
                      style={{
                        padding: '14px 18px',
                        background: 'rgba(15, 23, 42, 0.7)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--text-muted)',
                          marginBottom: '4px',
                        }}
                      >
                        Your Answer:
                      </div>
                      <p
                        style={{
                          color: item.userAnswer && item.userAnswer.trim() ? 'var(--text-primary)' : 'var(--score-fair)',
                          fontStyle: item.userAnswer && item.userAnswer.trim() ? 'normal' : 'italic',
                          fontSize: '0.95rem',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {item.userAnswer && item.userAnswer.trim()
                          ? item.userAnswer
                          : '[Skipped / No Answer Provided]'}
                      </p>
                    </div>

                    {/* Feedback */}
                    <div
                      style={{
                        padding: '14px 18px',
                        background: 'rgba(99, 102, 241, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#a5b4fc',
                          marginBottom: '4px',
                        }}
                      >
                        💡 AI Feedback & Critique:
                      </div>
                      <p style={{ color: 'var(--text-primary)', fontSize: '0.92rem', margin: 0 }}>
                        {item.feedback}
                      </p>
                    </div>

                    {/* Sample Answer */}
                    <div
                      style={{
                        padding: '14px 18px',
                        background: 'rgba(16, 185, 129, 0.08)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(16, 185, 129, 0.25)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: '#6ee7b7',
                          marginBottom: '4px',
                        }}
                      >
                        ✨ Strong Model Answer:
                      </div>
                      <p
                        style={{
                          color: '#e2e8f0',
                          fontSize: '0.92rem',
                          margin: 0,
                          lineHeight: 1.6,
                        }}
                      >
                        {item.sampleAnswer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
