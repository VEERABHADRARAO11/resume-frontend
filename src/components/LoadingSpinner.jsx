import React from 'react';

/**
 * Animated loading spinner with helpful status text
 */
export default function LoadingSpinner({
  title = 'Processing...',
  subtitle = 'Claude AI is analyzing your information. This takes a few moments.',
}) {
  return (
    <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
      <div className="spinner-container">
        <div className="spinner" />
        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{title}</h3>
        <p style={{ maxWidth: '480px', margin: '0 auto', fontSize: '0.95rem' }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
