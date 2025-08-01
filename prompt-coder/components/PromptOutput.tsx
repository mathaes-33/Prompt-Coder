import React, { useState, useEffect } from 'react';
import { Loader } from './Loader';
import { CopyIcon, CheckIcon, AlertTriangleIcon } from './Icons';
import { RefinedPromptResponse } from '../services/geminiService';

// Props updated to receive a structured response object
interface PromptOutputProps {
  response: RefinedPromptResponse | null;
  isLoading: boolean;
  error: string | null;
}

// ----- State-specific components for clean rendering logic -----

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400">
    <Loader />
    <span>Generating Brilliance...</span>
  </div>
);

const ErrorState: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-full gap-3 text-red-400">
    <AlertTriangleIcon className="w-12 h-12" />
    <p className="font-semibold">An Error Occurred</p>
    <p className="text-sm text-center text-red-300">{message}</p>
  </div>
);

const EmptyState = () => (
  <div className="flex items-center justify-center h-full text-gray-500">
    Your refined prompt will appear here...
  </div>
);

interface SuccessStateProps {
  response: RefinedPromptResponse;
}

const SuccessState: React.FC<SuccessStateProps> = ({ response }) => {
  const [isCopied, setIsCopied] = useState(false);
  const { prompt, improvements } = response;

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setIsCopied(true);
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <div className="space-y-6">
      <div>
        <div className="relative bg-gray-900 rounded-md group">
          <pre className="p-4 text-sm text-gray-200 whitespace-pre-wrap font-mono overflow-auto">{prompt}</pre>
          <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
            {isCopied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {improvements.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Key Improvements</h3>
          <div className="prose prose-sm prose-invert text-gray-300 max-w-none">
            <ul className="space-y-2">
              {improvements.map((line, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-400 mr-2 mt-1">&#10003;</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

// Main component, now acting as a router for different UI states
export const PromptOutput: React.FC<PromptOutputProps> = ({ response, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;
    if (!response || !response.prompt) return <EmptyState />;
    return <SuccessState response={response} />;
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg flex flex-col h-full ring-1 ring-white/10">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Refined Prompt</h2>
        <p className="text-gray-400 text-sm mt-1">AI-optimized for clarity and effectiveness.</p>
      </div>
      <div className="p-6 flex-grow min-h-[420px]">
        {renderContent()}
      </div>
    </div>
  );
};
