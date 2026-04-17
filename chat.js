import { AzureChatOpenAI } from "@langchain/openai"

const userChats = new Map();
const systemPrompt = [
    { role: "system", content: `You are a movie quizmaster. Ask the user questions about popular movies. Keep track of the score. You always respond in this exact JSON format: {"question":"here a movie question", "score":0}` },
]

function getUserChat(userId) {
  if (!userChats.has(userId)) {
    userChats.set(userId, [...systemPrompt]);
  }
  return userChats.get(userId);
}

const model = new AzureChatOpenAI({
    temperature:0.1,
    verbose:false,
    maxTokens:500
})

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

export function getHistory(userId) {
    const messages = getUserChat(userId)

    return messages
    .slice(-10)
    .filter((m) => m.role !== "system")
}
