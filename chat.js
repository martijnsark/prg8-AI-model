import { AzureChatOpenAI } from "@langchain/openai"

//save each user's chat history in memory
const userChats = new Map();

//system message that controls quizmaster behavior and response format
const systemPrompt = [
    { role: "system", content: `You are a study quizmaster named Yareli you are profesional, patient and motivational. 
      Introduce yourself and ask the user to share study information to create questions based on this study information or outright share questions with their awnsers. 
      Keep track of the score. You always respond in this exact JSON format: {"question":"here's a study question", "score":0}` },
]

//get existing chat for user or create a new one with system prompt
function getUserChat(userId) {
  if (!userChats.has(userId)) {
    userChats.set(userId, [...systemPrompt]);
  }
  return userChats.get(userId);
}

//ai model settings
const model = new AzureChatOpenAI({
    temperature:0.1,
    verbose:false,
    maxTokens:500
})

//send prompt to ai, save the full conversation, and return quiz json + tokens
export async function callOpenAI(userId, prompt) {
  const messages = getUserChat(userId);

  messages.push({ role: "user", content: prompt });
  const result = await model.invoke(messages)
  messages.push({ role: "ai", content: result.content });
  const quizData = JSON.parse(result.content)

  // token data toevoegen
  quizData.tokens = result.usage_metadata.total_tokens
  return quizData
}

//return the latest 10 non-system messages for chat history
export function getHistory(userId) {
    const messages = getUserChat(userId)

    return messages
    .slice(-10)
    .filter((m) => m.role !== "system")
}

//remove user chat history and start fresh
export function resetUser(userId) {
  userChats.delete(userId)
}
