import React from 'react';

/**
 * Dismissible error alert component
 */
export default function ErrorMessage({ message, onDismiss, onRetry }) {
  if (!message) return null;

  return (
    <div className="alert alert-danger" role="alert">
      <span style={{ fontSize: '1.25rem' }}>⚠️</span>
      <div style={{ flex: 1 }}>
        <strong>Error:</strong> {message}
      </div>
      {onRetry && (
        <button
          className="btn btn-outline"
          style={{ padding: '4px 10px', fontSize: '0.8rem', marginLeft: '10px' }}
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
      {onDismiss && (
        <button
          className="alert-dismiss"
          onClick={onDismiss}
          title="Dismiss error"
          aria-label="Dismiss error"
        >
          &times;
        </button>
      )}
    </div>
  );
}
