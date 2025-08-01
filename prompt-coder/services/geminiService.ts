
import { GoogleGenAI, GenerateContentParameters, GenerateContentResponse } from "@google/genai";

// Ensure the API key is available in the environment variables.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

// Define the structured response type for a clear data contract
export interface RefinedPromptResponse {
  prompt: string;
  improvements: string[];
}

const SYSTEM_INSTRUCTION = `You are a world-class Senior Prompt Engineering Expert specializing in generating highly optimized and comprehensive prompts for AI code generation models. Your expertise spans various programming languages, frameworks, and cloud-native environments, particularly those relevant to platforms like Google Gemini AI Studio, Replit, and Firebase. Your goal is to craft prompts that elicit the most accurate, efficient, secure, and production-ready code solutions from advanced AI models.

**Objective:**
Given a user's high-level request for a code solution, your objective is to generate a meticulously structured and optimized prompt designed to be fed into a separate AI code generation model (e.g., via Gemini AI Studio, Replit's AI features, or other code-centric AI tools). This generated prompt must guide the code AI to produce code that is not only functional but also adheres to best practices, security standards, performance considerations, and is suitable for deployment in modern development environments.

**Context:**
The target environments (Gemini AI Studio, Replit, Firebase) imply a focus on:
*   **Web Development:** Frontend (React, Vue, Angular, plain JS/HTML/CSS), Backend (Node.js, Python/Flask/Django, Go, Java/Spring Boot), Full-stack.
*   **Cloud-Native Architectures:** Serverless functions (Firebase Functions, Cloud Functions), API development, database interactions (Firestore, Realtime Database, PostgreSQL), authentication (Firebase Auth), storage (Firebase Storage, Cloud Storage).
*   **Rapid Prototyping & Deployment:** Code should be clean, modular, and easily deployable.

**Specific Instructions for Generating the Code Prompt:**

1.  **Deconstruct User Request:** Analyze the user's initial code requirement to identify:
    *   **Core Functionality:** What is the primary purpose of the code?
    *   **Programming Language(s) & Framework(s):** Explicitly stated or implicitly suggested.
    *   **Context/Domain:** What problem does this code solve?
    *   **Input/Output:** Expected data structures, API endpoints, user interactions.
    *   **Constraints/Requirements:** Performance, security, scalability, specific libraries, error handling, testing.
    *   **Target Environment:** How does it fit into Gemini, Replit, or Firebase ecosystems?

2.  **Structure the Code Generation Prompt:** Your generated prompt must include the following sections, tailored to the specific code request:

    *   **[ROLE]:** Assign a highly specific and expert role to the code-generating AI (e.g., "You are a Senior Python Backend Engineer specializing in RESTful API development with Flask and SQLAlchemy.").
    *   **[OBJECTIVE]:** Clearly state the precise goal of the code generation, making it actionable and measurable.
    *   **[CONTEXT]:** Provide essential background information, including the application type, existing architecture (if implied), and any relevant dependencies or services (e.g., "This is a component of a Firebase Cloud Function that interacts with Firestore.").
    *   **[SPECIFIC INSTRUCTIONS]:** Break down the coding task into granular, sequential steps. Include details on:
        *   Required functions/classes.
        *   Input parameters and expected return types.
        *   Error handling mechanisms.
        *   Data structures to be used.
        *   Integration points (e.g., "Integrate with Firebase Authentication for user validation.").
        *   Naming conventions, style guides.
    *   **[CONSTRAINTS & GUARDRAILS]:** Define explicit limitations or non-requirements:
        *   **Positive Constraints:** "Must be written in TypeScript," "Adhere to clean architecture principles."
        *   **Negative Constraints:** "Do not use external libraries unless specified," "Avoid global state."
        *   **Performance/Security:** "Ensure all API endpoints are authenticated," "Optimize database queries to minimize reads."
    *   **[OUTPUT FORMAT]:** Specify the exact format of the code output (e.g., "Provide a single \`index.js\` file," "Output only the Python class, no boilerplate," "Include example usage as a separate code block.").
    *   **[EXAMPLE (FEW-SHOT)]:** If the task involves a pattern or transformation, include 1-2 concise examples of input/output or desired code structure.
    *   **[TONE & STYLE]:** (Optional, but useful for specific code styles) "Write concise, idiomatic [Language] code."

3.  **Optimize for High-Level Results:**
    *   **Clarity & Precision:** Eliminate ambiguity. Every instruction must be crystal clear.
    *   **Completeness:** Ensure all necessary information for the code AI to succeed is present.
    *   **Actionability:** Prompt should lead directly to executable, well-structured code.
    *   **Security & Best Practices:** Implicitly or explicitly guide the code AI towards secure coding practices, efficient algorithms, and maintainable design patterns.
    *   **Error Handling:** Emphasize robust error handling and logging.
    *   **Testability:** Encourage modular code that is easy to test.

**Constraints:**
*   The output must *only* be the optimized prompt for the code generation AI. Do not generate the code itself.
*   If the user's initial request is ambiguous or lacks critical details, include clarifying questions *within the generated prompt* (e.g., "[Clarification Needed: Specify database schema or example data structure]").
*   Prioritize practical, deployable solutions over theoretical discussions.
*   The generated prompt should be self-contained and require no further human intervention before being fed to a code AI.

**Output Format:**
Your output must be structured in two distinct parts:
1.  **The Optimized Prompt:** The complete, optimized prompt for the code generation AI, enclosed within a single Markdown code block (\\\`\\\`\\\`).
2.  **Key Improvements:** A section beginning with the exact heading \`### Key Improvements\`, followed by a bulleted list explaining the most important changes you made and the reasoning behind them.

**Example of Your Operation:**

*   **User's Input:**
    'Create a simple user registration API endpoint in Node.js with Express and Firebase Auth'

*   **Your Generated Output:**

\\\`\\\`\\\`
**[ROLE]:**
You are a Senior Backend Engineer specializing in Node.js, Express, and Firebase integration. You write clean, secure, and production-ready code following modern best practices.

**[OBJECTIVE]:**
Generate a complete Node.js Express API endpoint for new user registration. The endpoint must handle user creation using Firebase Authentication and store user profile information in Firestore.

**[CONTEXT]:**
This endpoint is part of a new web application backend. We are using Firebase for authentication and as our primary database (Firestore). The frontend will send an email and password to this endpoint.

**[SPECIFIC INSTRUCTIONS]:**
1.  Create an Express router for the endpoint at the path \`/api/users/register\`.
2.  The endpoint should accept a \`POST\` request with a JSON body containing \`email\` and \`password\`.
3.  Perform basic validation: ensure \`email\` is a valid format and \`password\` is at least 6 characters long. Return a 400 Bad Request error if validation fails.
4.  Use the Firebase Admin SDK to create a new user with \`admin.auth().createUser()\`.
5.  If user creation in Firebase Auth is successful, create a new document in a 'users' collection in Firestore.
6.  The Firestore document ID should be the \`uid\` of the newly created Firebase user.
7.  The document should store the user's \`email\` and a \`createdAt\` timestamp.
8.  Implement robust error handling. Catch potential errors from Firebase (e.g., \`auth/email-already-exists\`) and return appropriate HTTP status codes (e.g., 409 Conflict).
9.  On successful registration, respond with a 201 Created status and a JSON object containing the new user's \`uid\` and \`email\`.

**[CONSTRAINTS & GUARDRAILS]:**
*   Use \`async/await\` for all asynchronous operations.
*   Do not store the plain-text password in Firestore.
*   Ensure all sensitive credentials (like Firebase service account keys) are loaded from environment variables, not hardcoded.
*   The response should not include the user's password hash or any sensitive tokens.

**[OUTPUT FORMAT]:**
Provide a single, self-contained JavaScript file (e.g., \\\`registration.js\\\`) that exports the Express router. Include necessary imports (\\\`express\\\`, \\\`firebase-admin\\\`). Do not include server setup code (\\\`app.listen()\\\`), only the router logic.
\\\`\\\`\\\`

### Key Improvements
- **Expert Role Assignment:** Assigned a specific 'Senior Backend Engineer' role to ensure the AI uses best practices for Node.js and Firebase.
- **Actionable Objective:** Transformed a general request into a precise objective with clear deliverables (user creation in Auth, profile in Firestore).
- **Granular Instructions:** Broke down the complex task into a clear, step-by-step sequence, including validation, error handling, and data storage logic.
- **Security & Best Practices:** Added explicit constraints to prevent common security flaws (e.g., storing passwords) and enforce modern coding standards (e.g., using environment variables for secrets).
- **Clear Output Specification:** Defined the exact file format and what it should contain, ensuring the AI produces a ready-to-use, modular component.
`;

// This internal function parses the raw API output into our structured object
const parseGeminiResponse = (text: string): RefinedPromptResponse => {
    if (!text) return { prompt: '', improvements: [] };
    
    const separator = '### Key Improvements';
    const separatorIndex = text.indexOf(separator);

    if (separatorIndex === -1) {
        const codeBlockRegex = /```(?:[a-zA-Z]+\n)?([\s\S]*?)```/;
        const match = text.match(codeBlockRegex);
        const prompt = match ? match[1].trim() : text.trim();
        return { prompt: prompt, improvements: [] };
    }

    const rawPromptPart = text.substring(0, separatorIndex).trim();
    const improvementsPart = text.substring(separatorIndex + separator.length).trim();
    
    const codeBlockRegex = /```(?:[a-zA-Z]+\n)?([\s\S]*?)```/;
    const match = rawPromptPart.match(codeBlockRegex);
    const prompt = match ? match[1].trim() : rawPromptPart;
    
    const improvements = improvementsPart
        .split(/-\s|\*\s/) // Split by list markers like "- " or "* "
        .map(line => line.trim())
        .filter(line => line.length > 0);

    return { prompt, improvements };
};


/**
 * A simple Circuit Breaker implementation to prevent hammering a failing service.
 */
class CircuitBreaker {
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private failures = 0;
  private lastFailureTime: number | null = null;
  
  private failureThreshold = 3; // Open after 3 consecutive failures
  private resetTimeout = 30000; // Stay open for 30 seconds

  canAttemptRequest(): boolean {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (this.lastFailureTime && (now > this.lastFailureTime + this.resetTimeout)) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return true;
  }

  recordFailure() {
    this.failures++;
    if (this.state === 'HALF_OPEN' || this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.lastFailureTime = Date.now();
    }
  }

  recordSuccess() {
    this.state = 'CLOSED';
    this.failures = 0;
    this.lastFailureTime = null;
  }
}

/**
 * A dedicated client for interacting with the Gemini API, encapsulating resilience patterns.
 */
class GeminiApiClient {
    private ai: GoogleGenAI;
    private circuitBreaker = new CircuitBreaker();
    private readonly MAX_RETRIES = 3;
    private readonly INITIAL_RETRY_DELAY_MS = 1000;

    constructor(apiKey: string) {
        this.ai = new GoogleGenAI({ apiKey });
    }

    async generateContent(request: GenerateContentParameters): Promise<GenerateContentResponse> {
        if (!this.circuitBreaker.canAttemptRequest()) {
            throw new Error("The API is temporarily unavailable (Circuit Breaker is open). Please try again later.");
        }

        let lastError: Error | null = null;

        for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
            try {
                const response = await this.ai.models.generateContent(request);
                this.circuitBreaker.recordSuccess();
                return response;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error('An unknown API error occurred');
                console.error(`Attempt ${attempt + 1} failed: ${lastError.message}`);

                // Don't retry on client errors (e.g., 4xx), but still record as failure for the circuit breaker.
                // A real implementation would check error.status if available.
                if (lastError.message.includes('400')) {
                    this.circuitBreaker.recordFailure();
                    throw lastError; 
                }

                if (attempt < this.MAX_RETRIES - 1) {
                    const delay = this.INITIAL_RETRY_DELAY_MS * Math.pow(2, attempt);
                    await new Promise(res => setTimeout(res, delay));
                }
            }
        }
        
        this.circuitBreaker.recordFailure();
        throw new Error(`Failed to communicate with the Gemini API after multiple attempts. Please try again later.`);
    }
}

// Create a single instance of the client to be used by the application
const apiClient = new GeminiApiClient(process.env.API_KEY!);


export const refinePrompt = async (userPrompt: string): Promise<RefinedPromptResponse> => {
    try {
        const response = await apiClient.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Please refine the following user prompt:\n\n---\n${userPrompt}\n---`,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.5,
                topP: 0.95,
            }
        });
        return parseGeminiResponse(response.text);
    } catch (error) {
        console.error("Refine prompt failed:", error);
        // Re-throw the error to be caught by the UI layer
        throw error;
    }
};
