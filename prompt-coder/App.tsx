
import React, { useReducer, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput, PromptData } from './components/PromptInput';
import { PromptOutput } from './components/PromptOutput';
import { refinePrompt, RefinedPromptResponse } from './services/geminiService';

type InputMode = 'structured' | 'simple';

// Define state shape and actions for the reducer
interface AppState {
  promptData: PromptData;
  simplePrompt: string;
  inputMode: InputMode;
  refinedResponse: RefinedPromptResponse | null;
  isLoading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'UPDATE_PROMPT_FIELD'; payload: { field: keyof PromptData; value: string } }
  | { type: 'UPDATE_SIMPLE_PROMPT'; payload: string }
  | { type: 'SET_INPUT_MODE'; payload: InputMode }
  | { type: 'SWITCH_TO_SIMPLE_MODE' }
  | { type: 'SWITCH_TO_STRUCTURED_MODE' }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: RefinedPromptResponse }
  | { type: 'FETCH_ERROR'; payload: string };

const initialState: AppState = {
  promptData: {
    role: '',
    objective: '',
    context: '',
    instructions: '',
    constraints: '',
  },
  simplePrompt: '',
  inputMode: 'structured',
  refinedResponse: null,
  isLoading: false,
  error: null,
};

// Helper to assemble structured data into a single string
const assemblePromptFromData = (data: PromptData): string => {
  const promptParts = [
    data.role.trim() && `[ROLE]\n${data.role.trim()}`,
    data.objective.trim() && `[OBJECTIVE]\n${data.objective.trim()}`,
    data.context.trim() && `[CONTEXT]\n${data.context.trim()}`,
    data.instructions.trim() && `[SPECIFIC INSTRUCTIONS]\n${data.instructions.trim()}`,
    data.constraints.trim() && `[CONSTRAINTS]\n${data.constraints.trim()}`,
  ];
  return promptParts.filter(Boolean).join('\n\n---\n\n');
};


// The reducer function handles all state transitions
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'UPDATE_PROMPT_FIELD':
      return {
        ...state,
        error: null,
        promptData: {
          ...state.promptData,
          [action.payload.field]: action.payload.value,
        },
      };
    case 'UPDATE_SIMPLE_PROMPT':
      return { ...state, error: null, simplePrompt: action.payload };
    case 'SET_INPUT_MODE':
      return { ...state, inputMode: action.payload };
    case 'SWITCH_TO_SIMPLE_MODE':
      return {
        ...state,
        inputMode: 'simple',
        simplePrompt: assemblePromptFromData(state.promptData),
      };
    case 'SWITCH_TO_STRUCTURED_MODE':
       return {
        ...state,
        inputMode: 'structured',
        promptData: initialState.promptData, // Clear structured fields
      };
    case 'FETCH_START':
      return { ...state, isLoading: true, error: null, refinedResponse: null };
    case 'FETCH_SUCCESS':
      return { ...state, isLoading: false, refinedResponse: action.payload };
    case 'FETCH_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleModeChange = useCallback((newMode: InputMode) => {
    if (newMode === state.inputMode) return;

    if (newMode === 'simple') {
      dispatch({ type: 'SWITCH_TO_SIMPLE_MODE' });
    } else if (newMode === 'structured') {
      if (state.simplePrompt.trim() && !window.confirm("Switching to Structured Mode will clear your current prompt. Do you want to continue?")) {
        return;
      }
      dispatch({ type: 'SWITCH_TO_STRUCTURED_MODE' });
    }
  }, [state.inputMode, state.simplePrompt]);

  const handleRefinePrompt = useCallback(async () => {
    const isSimpleMode = state.inputMode === 'simple';
    const hasObjective = state.promptData.objective.trim().length > 0;
    const hasSimpleText = state.simplePrompt.trim().length > 0;

    if ((isSimpleMode && !hasSimpleText) || (!isSimpleMode && !hasObjective)) {
       dispatch({ type: 'FETCH_ERROR', payload: isSimpleMode ? 'Please enter a prompt idea to refine.' : 'The "Objective" field is required to refine a prompt.' });
       return;
    }
    
    const assembledPrompt = isSimpleMode ? state.simplePrompt : assemblePromptFromData(state.promptData);

    dispatch({ type: 'FETCH_START' });
    try {
      const result = await refinePrompt(assembledPrompt);
      dispatch({ type: 'FETCH_SUCCESS', payload: result });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      dispatch({ type: 'FETCH_ERROR', payload: message });
      console.error(err);
    }
  }, [state.promptData, state.inputMode, state.simplePrompt]);

  return (
    <div className="min-h-screen bg-black/20 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PromptInput
            inputMode={state.inputMode}
            onModeChange={handleModeChange}
            structuredValue={state.promptData}
            onStructuredChange={(field, value) =>
              dispatch({ type: 'UPDATE_PROMPT_FIELD', payload: { field, value } })
            }
            simpleValue={state.simplePrompt}
            onSimpleChange={(value) => dispatch({ type: 'UPDATE_SIMPLE_PROMPT', payload: value })}
            onSubmit={handleRefinePrompt}
            isLoading={state.isLoading}
          />
          <PromptOutput
            response={state.refinedResponse}
            isLoading={state.isLoading}
            error={state.error}
          />
        </div>
        <footer className="text-center text-gray-400 mt-12 pb-8">
            <p>Powered by Google Gemini. Built for you.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
