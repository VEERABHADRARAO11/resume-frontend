import React from 'react';

/**
 * Top navigation header component
 */
export default function Header({ activeTab, onTabChange, onReset }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand" onClick={onReset} role="button" tabIndex={0} title="Start new session">
          <div className="brand-icon">📄</div>
          <div>
            <h1 className="brand-title">ResumeAI</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Resume Analyzer & Interview Practice
            </p>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Main Navigation">
          <button
            className={`nav-tab ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => onTabChange('practice')}
          >
            🎯 Practice
          </button>
          <button
            className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => onTabChange('history')}
          >
            📜 History
          </button>
        </nav>
      </div>
    </header>
  );
}
