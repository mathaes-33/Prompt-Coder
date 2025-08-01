
import React from 'react';
import { WandIcon } from './Icons';

export interface PromptData {
  role: string;
  objective: string;
  context: string;
  instructions: string;
  constraints: string;
}

type InputMode = 'structured' | 'simple';

interface PromptInputProps {
  inputMode: InputMode;
  onModeChange: (mode: InputMode) => void;
  structuredValue: PromptData;
  onStructuredChange: (field: keyof PromptData, value: string) => void;
  simpleValue: string;
  onSimpleChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

interface InputSectionProps {
  label: string;
  description: string;
  fieldName: keyof PromptData;
  value: string;
  onChange: (field: keyof PromptData, value: string) => void;
  placeholder: string;
  isLoading: boolean;
  rows?: number;
  isRequired?: boolean;
}

const InputSection: React.FC<InputSectionProps> = ({
  label,
  description,
  fieldName,
  value,
  onChange,
  placeholder,
  isLoading,
  rows = 3,
  isRequired = false,
}) => (
  <div>
    <label htmlFor={fieldName} className="block text-md font-bold text-gray-100">
      {label} {isRequired && <span className="text-red-400">*</span>}
    </label>
    <p className="text-sm text-gray-400 mb-2">{description}</p>
    <textarea
      id={fieldName}
      name={fieldName}
      value={value}
      onChange={(e) => onChange(fieldName, e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y font-mono text-sm"
      disabled={isLoading}
      aria-required={isRequired}
    />
  </div>
);

const ModeToggle: React.FC<{
  currentMode: InputMode;
  onModeChange: (mode: InputMode) => void;
  isLoading: boolean;
}> = ({ currentMode, onModeChange, isLoading }) => (
  <div className="flex justify-center p-1 bg-gray-700 rounded-lg">
    <button
      onClick={() => onModeChange('structured')}
      disabled={isLoading}
      className={`w-1/2 px-4 py-2 text-sm font-bold rounded-md transition-colors duration-200 ${
        currentMode === 'structured' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
      }`}
      aria-pressed={currentMode === 'structured'}
    >
      Structured
    </button>
    <button
      onClick={() => onModeChange('simple')}
      disabled={isLoading}
      className={`w-1/2 px-4 py-2 text-sm font-bold rounded-md transition-colors duration-200 ${
        currentMode === 'simple' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'
      }`}
      aria-pressed={currentMode === 'simple'}
    >
      Simple
    </button>
  </div>
);


export const PromptInput: React.FC<PromptInputProps> = ({ 
  inputMode, 
  onModeChange, 
  structuredValue, 
  onStructuredChange,
  simpleValue,
  onSimpleChange,
  onSubmit, 
  isLoading 
}) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg flex flex-col h-full ring-1 ring-white/10">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Craft Your Prompt</h2>
        <p className="text-gray-400 text-sm mt-1">
          Use Structured for guided input or Simple for a quick start.
        </p>
      </div>

      <div className="p-6 flex-grow flex flex-col gap-4 overflow-y-auto">
        <ModeToggle currentMode={inputMode} onModeChange={onModeChange} isLoading={isLoading} />
        
        {inputMode === 'structured' ? (
          <div className="space-y-6 mt-4">
            <InputSection
                label="Objective"
                description="The primary goal. What do you want the AI to do?"
                fieldName="objective"
                value={structuredValue.objective}
                onChange={onStructuredChange}
                placeholder="e.g., 'Build a to-do list app with React and Node.js'"
                isLoading={isLoading}
                isRequired
                rows={2}
            />
            <InputSection
                label="Role"
                description="The persona the AI should adopt."
                fieldName="role"
                value={structuredValue.role}
                onChange={onStructuredChange}
                placeholder="e.g., 'Act as a senior full-stack developer specializing in the MERN stack.'"
                isLoading={isLoading}
                rows={2}
            />
             <InputSection
                label="Specific Instructions"
                description="Provide step-by-step instructions or key requirements."
                fieldName="instructions"
                value={structuredValue.instructions}
                onChange={onStructuredChange}
                placeholder={"e.g., '1. Set up a basic Express server.\n2. Create API endpoints for CRUD operations.\n3. Use functional components and Hooks in React.'"}
                isLoading={isLoading}
                rows={4}
            />
            <InputSection
                label="Context"
                description="Provide any relevant background information."
                fieldName="context"
                value={structuredValue.context}
                onChange={onStructuredChange}
                placeholder="e.g., 'This is for a personal portfolio project. The focus is on clean code and best practices.'"
                isLoading={isLoading}
            />
            <InputSection
                label="Constraints"
                description="What the AI should NOT do. Define limitations."
                fieldName="constraints"
                value={structuredValue.constraints}
                onChange={onStructuredChange}
                placeholder="e.g., '- Do not use class components.\n- Avoid external state management libraries like Redux.\n- The styling should be done with Tailwind CSS.'"
                isLoading={isLoading}
            />
        </div>
        ) : (
          <div className="mt-4 flex-grow flex flex-col">
            <label htmlFor="simple-prompt" className="block text-md font-bold text-gray-100">
                Your Prompt Idea
            </label>
            <p className="text-sm text-gray-400 mb-2">Enter your raw idea, and the AI will create a refined, structured prompt for you.</p>
            <textarea
              id="simple-prompt"
              name="simple-prompt"
              value={simpleValue}
              onChange={(e) => onSimpleChange(e.target.value)}
              placeholder="e.g., 'I need a python script that reads a csv file, finds all the duplicate rows, and writes the unique rows to a new file.'"
              className="w-full flex-grow bg-gray-900 border border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y font-mono text-sm"
              disabled={isLoading}
              rows={15}
            />
          </div>
        )}
      </div>

       <div className="p-6 border-t border-gray-700/50 mt-auto">
        <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
        >
            {isLoading ? (
            'Refining...'
            ) : (
            <>
                <WandIcon className="w-5 h-5" />
                <span>Refine Prompt</span>
            </>
            )}
        </button>
      </div>
    </div>
  );
};
