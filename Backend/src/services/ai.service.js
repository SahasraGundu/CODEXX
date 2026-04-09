// import { GoogleGenerativeAI } from '@google/generative-ai';
// import config from '../config/config.js';

// // Debug (optional but useful)
// console.log("API KEY LOADED:", config.GOOGLE_API_KEY ? "YES" : "NO");

// const ai = new GoogleGenerativeAI(config.GOOGLE_API_KEY);

// class AIService {
//   async reviewCode(code, language = 'javascript') {
//     if (!code || typeof code !== 'string') {
//       throw new Error('Invalid input: code must be a non-empty string.');
//     }

//     try {
//       console.log(`Reviewing ${language} code...`);

//       const model = ai.getGenerativeModel({
//         model: 'gemini-2.0-flash', // ✅ stable model
//       });

//       const prompt = this.buildPrompt(code, language);

//       const result = await model.generateContent(prompt);

//       // ✅ FULL SAFETY CHECKS
//       if (
//         !result ||
//         !result.response ||
//         !result.response.candidates ||
//         result.response.candidates.length === 0
//       ) {
//         throw new Error('Empty response from AI');
//       }

//       const text = result.response.text();

//       if (!text || text.trim() === '') {
//         throw new Error('AI returned empty text');
//       }

//       return {
//         success: true,
//         review: text,
//       };

//     } catch (err) {
//       const msg = err?.message || '';
//       console.error('AI ERROR FULL:', err);

//       // 🚫 Quota exceeded
//       if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('Quota')) {
//         return {
//           success: false,
//           reason: 'AI_QUOTA_EXCEEDED',
//           review: this.getQuotaExceededReview(language),
//         };
//       }

//       // ⚠️ Empty / failed AI response
//       if (msg.includes('Empty response') || msg.includes('empty')) {
//         return {
//           success: false,
//           reason: 'AI_EMPTY',
//           review: this.getFallbackReview(language),
//         };
//       }

//       // ⚠️ General failure
//       return {
//         success: false,
//         reason: 'AI_FAILED',
//         review: this.getFallbackReview(language),
//       };
//     }
//   }

//   buildPrompt(code, language) {
//     return `
// You are a senior ${language} developer and code reviewer.

// Your task is to analyze the code step by step and produce a structured review.

// IMPORTANT RULES:
// - Be clear and concise
// - Do NOT repeat the entire code
// - Use markdown headings
// - Max 3–5 key issues
// - Suggestions must be practical

// ---
// ## 1️⃣ Current Code Behavior
// Explain clearly:
// - What this code does
// - How it executes
// - What happens when it runs

// ## 2️⃣ Current Output / Result
// Describe:
// - What output or result this code produces
// - Any side effects (logs, mutations, API calls, state changes)

// ## 3️⃣ Issues & Risks
// Identify:
// - Bugs or logical issues
// - Edge cases
// - Performance concerns
// - Security problems (if any)

// ## 4️⃣ Suggestions & Improvements
// Give actionable improvements with short explanations.

// ## 5️⃣ Improved Code Snippet
// Provide ONLY the improved or corrected part of the code.
// Keep it minimal.

// ## 6️⃣ Important Notes
// Mention:
// - Best practices
// - Modern way
// - Scalability concerns
// - Maintainability tips
// - Testing suggestions

// ---
// CODE TO REVIEW:
// \`\`\`${language}
// ${code}
// \`\`\`

// End with a short encouraging sentence.
// `;
//   }

//   getFallbackReview(language) {
//     return `## ⚠️ AI Review Unavailable

// The AI service returned no valid response.

// ### Suggestions
// - Add error handling
// - Improve naming consistency
// - Follow ${language} best practices
// - Write unit tests

// ### Keep going
// Your structure is on the right track 👍`;
//   }

//   getQuotaExceededReview(language) {
//     return `## 🚫 AI Quota Reached

// Your Gemini API quota has been exhausted.

// ### What you can do
// - Enable billing in Google Cloud
// - Wait for quota reset
// - Switch to a paid plan

// ### Status
// - Language: ${language}
// - AI Engine: Gemini

// 💡 This does NOT affect your project functionality.`;
//   }
// }

// export default new AIService();


import Groq from 'groq-sdk';
import config from '../config/config.js';

const client = new Groq({ apiKey: config.GROQ_API_KEY });

class AIService {
  async reviewCode(code, language = 'javascript') {
    if (!code || typeof code !== 'string') {
      throw new Error('Invalid input: code must be a non-empty string.');
    }

    try {
      console.log(`Reviewing ${language} code with Groq...`);

      const completion = await client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: this.buildPrompt(code, language),
          },
        ],
      });

      const text = completion.choices[0]?.message?.content;

      if (!text || text.trim() === '') {
        throw new Error('AI returned empty text');
      }

      return { success: true, review: text };

    } catch (err) {
      console.error('AI ERROR:', err);
      return {
        success: false,
        reason: 'AI_FAILED',
        review: this.getFallbackReview(language),
      };
    }
  }

  buildPrompt(code, language) {
    return `You are a senior ${language} developer and code reviewer.

## 1️⃣ Current Code Behavior
Explain what this code does and how it executes.

## 2️⃣ Current Output / Result
Describe what output or result this code produces.

## 3️⃣ Issues & Risks
Identify bugs, edge cases, performance concerns, security problems.

## 4️⃣ Suggestions & Improvements
Give actionable improvements with short explanations.

## 5️⃣ Improved Code Snippet
Provide only the improved or corrected part of the code.

## 6️⃣ Important Notes
Mention best practices, modern approaches, scalability and maintainability tips.

CODE TO REVIEW:
\`\`\`${language}
${code}
\`\`\`

End with a short encouraging sentence.`;
  }

  getFallbackReview(language) {
    return `## ⚠️ AI Review Unavailable\n\nThe AI service returned no valid response.\n\n### Suggestions\n- Add error handling\n- Follow ${language} best practices\n- Write unit tests`;
  }
}

export default new AIService();

