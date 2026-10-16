import React from 'react';

/**
 * Helper to determine CSS class and label based on a 0-100 score
 */
function getScoreGrade(score) {
  if (score >= 85) return { colorClass: 'excellent', label: 'Excellent' };
  if (score >= 70) return { colorClass: 'good', label: 'Strong' };
  if (score >= 50) return { colorClass: 'fair', label: 'Fair' };
  return { colorClass: 'poor', label: 'Needs Work' };
}

/**
 * Step 2: Resume Score & Analysis Report
 */
export default function ResumeScoreStep({
  analysisData,
  onStartInterview,
  onReupload,
  isGeneratingQuestions,
}) {
  if (!analysisData) return null;

  const { fileName, scores, strengths = [], weaknesses = [], suggestions = [] } = analysisData;
  const overall = scores?.overall ?? 0;
  const breakdown = scores?.breakdown ?? {};
  const grade = getScoreGrade(overall);

  const breakdownItems = [
    { label: 'Technical Skills', key: 'skills', val: breakdown.skills ?? 0 },
    { label: 'Experience & Impact', key: 'experience', val: breakdown.experience ?? 0 },
    { label: 'Projects & Implementations', key: 'projects', val: breakdown.projects ?? 0 },
    { label: 'Education & Credentials', key: 'education', val: breakdown.education ?? 0 },
    { label: 'Clarity & Formatting', key: 'clarityFormatting', val: breakdown.clarityFormatting ?? 0 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner Card with Overall Score */}
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
            <span className="badge badge-indigo" style={{ marginBottom: '8px' }}>
              Resume Analysis Complete
            </span>
            <h2 style={{ fontSize: '1.75rem', marginBottom: '6px' }}>
              Resume Score Report
            </h2>
            <p style={{ fontSize: '0.95rem' }}>
              File: <strong style={{ color: 'var(--text-primary)' }}>{fileName}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: `var(--score-${grade.colorClass})` }}>
                {grade.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Overall Rating
              </div>
            </div>
            <div className={`score-badge lg ${grade.colorClass}`}>
              {overall}
            </div>
          </div>
        </div>

        {/* Action button to proceed to interview */}
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
          <button className="btn btn-outline" onClick={onReupload}>
            ← Upload Another Resume
          </button>
          <button
            className="btn btn-primary btn-lg"
            onClick={onStartInterview}
            disabled={isGeneratingQuestions}
          >
            <span>🎙️</span> Start AI Interview Practice (10 Questions) →
          </button>
        </div>
      </div>

      {/* Breakdown Scores */}
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
          Detailed Category Breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {breakdownItems.map((item) => {
            const itemGrade = getScoreGrade(item.val);
            return (
              <div key={item.key}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '6px',
                    fontSize: '0.95rem',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: `var(--score-${itemGrade.colorClass})` }}>
                    {item.val} / 100
                  </span>
                </div>
                <div className="progress-container">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${item.val}%`,
                      background: `var(--score-${itemGrade.colorClass})`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid-2">
        {/* Strengths */}
        <div className="card" style={{ borderColor: 'rgba(16, 185, 129, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.4rem' }}>🌟</span>
            <h3 style={{ fontSize: '1.2rem', color: '#6ee7b7' }}>Key Strengths</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {strengths.map((str, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '0.92rem',
                }}
              >
                <span style={{ color: 'var(--score-excellent)', fontWeight: 800 }}>✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="card" style={{ borderColor: 'rgba(245, 158, 11, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
            <h3 style={{ fontSize: '1.2rem', color: '#fcd34d' }}>Areas for Improvement</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {weaknesses.map((weak, idx) => (
              <li
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  fontSize: '0.92rem',
                }}
              >
                <span style={{ color: 'var(--score-fair)', fontWeight: 800 }}>!</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Suggestions for improvement */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span style={{ fontSize: '1.4rem' }}>💡</span>
          <h3 style={{ fontSize: '1.2rem', color: '#a5b4fc' }}>
            Actionable Suggestions to Boost Your Score
          </h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span
                style={{
                  background: 'var(--accent-primary)',
                  color: '#ffffff',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {idx + 1}
              </span>
              <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                {sug}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
