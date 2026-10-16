import React, { useState } from 'react';
import Header from './components/Header';
import UploadStep from './components/UploadStep';
import ResumeScoreStep from './components/ResumeScoreStep';
import InterviewStep from './components/InterviewStep';
import ResultsStep from './components/ResultsStep';
import HistoryStep from './components/HistoryStep';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { uploadResume, startInterview, submitInterview } from './services/api';

export default function App() {
  // Navigation tabs: 'practice' | 'history'
  const [activeTab, setActiveTab] = useState('practice');

  // Practice steps: 'upload' | 'resume-score' | 'interview' | 'results'
  const [step, setStep] = useState('upload');

  // Loading state & custom messages
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState('');
  const [loadingSubtitle, setLoadingSubtitle] = useState('');

  // Central error state
  const [errorMessage, setErrorMessage] = useState(null);

  // App data store
  const [resumeData, setResumeData] = useState(null);
  const [interviewData, setInterviewData] = useState(null);
  const [resultsData, setResultsData] = useState(null);

  // Step 1: Upload and analyze resume
  const handleUpload = async (file) => {
    setIsLoading(true);
    setLoadingTitle('Extracting & Analyzing Resume...');
    setLoadingSubtitle('Reading text from PDF and generating detailed recruiter analysis with Claude.');
    setErrorMessage(null);

    try {
      const data = await uploadResume(file);
      setResumeData(data);
      setStep('resume-score');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to upload and analyze resume.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Start interview and generate 10 questions
  const handleStartInterview = async () => {
    if (!resumeData || !resumeData.resumeId) {
      setErrorMessage('No active resume found to start interview.');
      return;
    }

    setIsLoading(true);
    setLoadingTitle('Generating Interview Questions...');
    setLoadingSubtitle('Claude is tailoring 10 specific questions based on your resume technologies and projects.');
    setErrorMessage(null);

    try {
      const data = await startInterview(resumeData.resumeId);
      setInterviewData(data);
      setStep('interview');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to generate interview questions.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Submit candidate answers for grading & feedback
  const handleSubmitInterview = async (answers) => {
    if (!interviewData || !interviewData.interviewId) {
      setErrorMessage('No active interview session found.');
      return;
    }

    setIsLoading(true);
    setLoadingTitle('Evaluating Your Interview...');
    setLoadingSubtitle('Claude is grading your answers, writing constructive feedback, and crafting model answers.');
    setErrorMessage(null);

    try {
      const data = await submitInterview(interviewData.interviewId, answers);
      setResultsData(data);
      setStep('results');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit and evaluate interview answers.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset back to upload
  const handleReset = () => {
    setResumeData(null);
    setInterviewData(null);
    setResultsData(null);
    setStep('upload');
    setActiveTab('practice');
    setErrorMessage(null);
  };

  // Switch to viewing an existing resume score from the history page
  const handleViewResumeFromHistory = (item) => {
    setResumeData(item);
    setStep('resume-score');
    setActiveTab('practice');
  };

  // Helper for Stepper display
  const getStepNumber = (s) => {
    switch (s) {
      case 'upload':
        return 1;
      case 'resume-score':
        return 2;
      case 'interview':
        return 3;
      case 'results':
        return 4;
      default:
        return 1;
    }
  };

  const currentStepNum = getStepNumber(step);

  return (
    <div className="app-container">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setErrorMessage(null);
        }}
        onReset={handleReset}
      />

      <main className="main-content">
        {/* Error message banner */}
        <ErrorMessage
          message={errorMessage}
          onDismiss={() => setErrorMessage(null)}
        />

        {activeTab === 'practice' ? (
          <>
            {/* Step Wizard Bar */}
            <div className="wizard-stepper">
              <div className={`wizard-step ${currentStepNum === 1 ? 'active' : currentStepNum > 1 ? 'completed' : ''}`}>
                <div className="step-circle">{currentStepNum > 1 ? '✓' : '1'}</div>
                <span>Upload</span>
              </div>
              <div className={`step-divider ${currentStepNum > 1 ? 'completed' : ''}`} />

              <div className={`wizard-step ${currentStepNum === 2 ? 'active' : currentStepNum > 2 ? 'completed' : ''}`}>
                <div className="step-circle">{currentStepNum > 2 ? '✓' : '2'}</div>
                <span>Score & Feedback</span>
              </div>
              <div className={`step-divider ${currentStepNum > 2 ? 'completed' : ''}`} />

              <div className={`wizard-step ${currentStepNum === 3 ? 'active' : currentStepNum > 3 ? 'completed' : ''}`}>
                <div className="step-circle">{currentStepNum > 3 ? '✓' : '3'}</div>
                <span>Interview Practice</span>
              </div>
              <div className={`step-divider ${currentStepNum > 3 ? 'completed' : ''}`} />

              <div className={`wizard-step ${currentStepNum === 4 ? 'active' : ''}`}>
                <div className="step-circle">4</div>
                <span>Evaluation</span>
              </div>
            </div>

            {/* Loading Spinner */}
            {isLoading && (
              <LoadingSpinner title={loadingTitle} subtitle={loadingSubtitle} />
            )}

            {/* Step 1: Upload */}
            {!isLoading && step === 'upload' && (
              <UploadStep onUpload={handleUpload} isLoading={isLoading} />
            )}

            {/* Step 2: Resume Score Report */}
            {!isLoading && step === 'resume-score' && (
              <ResumeScoreStep
                analysisData={resumeData}
                onStartInterview={handleStartInterview}
                onReupload={handleReset}
                isGeneratingQuestions={isLoading}
              />
            )}

            {/* Step 3: Interview Q&A */}
            {!isLoading && step === 'interview' && (
              <InterviewStep
                questions={interviewData?.questions}
                onSubmitInterview={handleSubmitInterview}
                onCancel={() => setStep('resume-score')}
                isSubmitting={isLoading}
              />
            )}

            {/* Step 4: Final Evaluation Results */}
            {!isLoading && step === 'results' && (
              <ResultsStep
                resultsData={resultsData}
                onRetakeInterview={handleStartInterview}
                onNewResume={handleReset}
                onGoToHistory={() => setActiveTab('history')}
              />
            )}
          </>
        ) : (
          /* History Tab */
          <HistoryStep
            onStartNewPractice={handleReset}
            onViewSessionDetails={handleViewResumeFromHistory}
          />
        )}
      </main>
    </div>
  );
}
