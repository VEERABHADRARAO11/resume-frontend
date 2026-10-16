import React, { useState } from 'react';

/**
 * Step 3: Interactive Interview Practice (10 Questions, 1 at a time)
 */
export default function InterviewStep({
  questions = [],
  onSubmitInterview,
  onCancel,
  isSubmitting,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  if (!questions || questions.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
        <h3>No questions available.</h3>
        <button className="btn btn-primary" style={{ marginTop: '16px' }} onClick={onCancel}>
          Back to Overview
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  const currentAnswer = answers[currentQ.id] || '';

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentQ.id]: e.target.value,
    });
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    // If not answered yet, ensure it is recorded as empty string
    if (!answers[currentQ.id]) {
      setAnswers({
        ...answers,
        [currentQ.id]: '',
      });
    }

    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmitAll();
    }
  };

  const handleSubmitAll = () => {
    // Convert answers object into array matching server expectation
    const formattedAnswers = questions.map((q) => ({
      questionId: q.id,
      userAnswer: answers[q.id] || '',
    }));

    onSubmitInterview(formattedAnswers);
  };

  const isLastQuestion = currentIndex === total - 1;
  const answeredCount = Object.values(answers).filter((a) => a && a.trim().length > 0).length;

  return (
    <div className="card">
      {/* Top Header: Progress and Status */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className="badge badge-indigo">
              {currentQ.category || 'Interview Question'}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {answeredCount} of {total} answered
            </span>
          </div>

          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Question {currentIndex + 1} of {total}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '24px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
          Interviewer Prompt
        </div>
        <h3 style={{ fontSize: '1.25rem', lineHeight: 1.5, color: 'var(--text-primary)' }}>
          "{currentQ.question}"
        </h3>
      </div>

      {/* User Answer Textarea */}
      <div style={{ marginBottom: '24px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
          }}
        >
          <label htmlFor="interview-answer" style={{ fontSize: '0.9rem', fontWeight: 600 }}>
            Your Answer:
          </label>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {currentAnswer.length} characters
          </span>
        </div>

        <textarea
          id="interview-answer"
          className="textarea-answer"
          rows={6}
          placeholder="Speak or type your answer here... Be specific and use real examples from your projects or experience. You can also skip if you prefer."
          value={currentAnswer}
          onChange={handleAnswerChange}
          disabled={isSubmitting}
        />
      </div>

      {/* Navigation & Submission Controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '20px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-outline"
            onClick={handlePrev}
            disabled={currentIndex === 0 || isSubmitting}
          >
            ← Previous
          </button>
          <button
            className="btn btn-secondary"
            onClick={handleSkip}
            disabled={isSubmitting}
            title="Skip this question without penalty"
          >
            Skip Question ⏭
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {!isLastQuestion ? (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={isSubmitting}
            >
              Next Question →
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={handleSubmitAll}
              disabled={isSubmitting}
              style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
            >
              <span>🎯</span> Submit Interview & Get Evaluation
            </button>
          )}
        </div>
      </div>

      {/* Quick Jump Question Indicators */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '6px',
          marginTop: '28px',
          flexWrap: 'wrap',
        }}
      >
        {questions.map((q, idx) => {
          const hasAnswer = answers[q.id] && answers[q.id].trim().length > 0;
          const isCurrent = idx === currentIndex;

          let bg = 'var(--bg-tertiary)';
          let border = '1px solid var(--border-subtle)';
          let color = 'var(--text-muted)';

          if (isCurrent) {
            border = '2px solid var(--accent-primary)';
            color = '#ffffff';
          } else if (hasAnswer) {
            bg = 'rgba(16, 185, 129, 0.2)';
            border = '1px solid rgba(16, 185, 129, 0.5)';
            color = 'var(--score-excellent)';
          }

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: bg,
                border: border,
                color: color,
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              title={`Question ${idx + 1}: ${hasAnswer ? 'Answered' : 'Not answered'}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}
