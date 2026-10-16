import React, { useState, useRef } from 'react';

/**
 * Step 1: Upload resume PDF with validation (PDF only, max 5 MB)
 */
export default function UploadStep({ onUpload, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Validate file requirements
  const validateAndSetFile = (file) => {
    setValidationError('');

    if (!file) return;

    // Check file extension / MIME
    const isPdf =
      file.type === 'application/pdf' ||
      file.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setValidationError('Invalid file type. Please upload a PDF document (.pdf).');
      setSelectedFile(null);
      return;
    }

    // Check size limit: 5 MB = 5 * 1024 * 1024 bytes
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setValidationError('File is too large. Maximum allowed size is 5 MB.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    validateAndSetFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      setValidationError('Please select or drag a PDF resume to upload.');
      return;
    }
    onUpload(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="card">
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.85rem', marginBottom: '10px' }}>
          Upload Your Resume
        </h2>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.02rem' }}>
          Get an instant AI breakdown of your score, strengths, and weaknesses,
          followed by tailored interview practice based strictly on your experience.
        </p>
      </div>

      {validationError && (
        <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
          <span>⚠️</span>
          <span style={{ flex: 1 }}>{validationError}</span>
          <button
            className="alert-dismiss"
            onClick={() => setValidationError('')}
            aria-label="Dismiss error"
          >
            &times;
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/pdf,.pdf"
        style={{ display: 'none' }}
      />

      {/* Drag & Drop Area */}
      <div
        className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <span className="dropzone-icon">📄</span>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>
          {selectedFile ? 'Change Selected PDF' : 'Click to browse or drop your resume here'}
        </h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Accepted format: <strong>PDF only</strong> (Max size: 5 MB)
        </p>
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div className="file-preview">
          <div className="file-info">
            <span className="file-icon">📑</span>
            <div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {selectedFile.name}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {formatFileSize(selectedFile.size)} • PDF Document
              </p>
            </div>
          </div>
          <button
            className="btn btn-outline"
            style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
            }}
          >
            Remove
          </button>
        </div>
      )}

      {/* Action CTA */}
      <div style={{ marginTop: '32px', textAlign: 'center' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={handleUploadSubmit}
          disabled={!selectedFile || isLoading}
          style={{ width: '100%', maxWidth: '380px' }}
        >
          <span>🚀</span> Analyze Resume with AI
        </button>
      </div>

      {/* Informative Feature Cards */}
      <div className="grid-3" style={{ marginTop: '40px', borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
        <div style={{ padding: '12px' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '6px', color: 'var(--accent-secondary)' }}>
            1. Text Extraction
          </h4>
          <p style={{ fontSize: '0.85rem' }}>
            Pure text parsing ignores logos, photos, and icons to focus 100% on what recruiters and ATS scan.
          </p>
        </div>
        <div style={{ padding: '12px' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '6px', color: 'var(--accent-secondary)' }}>
            2. Detailed Scoring
          </h4>
          <p style={{ fontSize: '0.85rem' }}>
            Get an overall score from 0 to 100 with category breakdowns for skills, experience, and formatting.
          </p>
        </div>
        <div style={{ padding: '12px' }}>
          <h4 style={{ fontSize: '0.95rem', marginBottom: '6px', color: 'var(--accent-secondary)' }}>
            3. 10 Mock Questions
          </h4>
          <p style={{ fontSize: '0.85rem' }}>
            AI builds 10 custom interview questions based strictly on your projects and technologies.
          </p>
        </div>
      </div>
    </div>
  );
}
