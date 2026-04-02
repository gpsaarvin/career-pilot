const OpenAI = require("openai");

function getClient() {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return null;
  }

  const baseURL =
    process.env.OPENROUTER_API_KEY
      ? process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1"
      : process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

  return new OpenAI({ apiKey, baseURL });
}

function getModel() {
  return (
    process.env.OPENROUTER_MODEL ||
    process.env.AI_MODEL ||
    "gpt-4o-mini"
  );
}

async function promptJson(systemPrompt, userPrompt, fallbackValue, options = {}) {
  const client = getClient();
  if (!client) {
    return fallbackValue;
  }

  try {
    const completion = await client.chat.completions.create({
      model: options.model || getModel(),
      temperature: typeof options.temperature === "number" ? options.temperature : 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = completion.choices?.[0]?.message?.content;
    if (!content) {
      return fallbackValue;
    }

    return JSON.parse(content);
  } catch (error) {
    return fallbackValue;
  }
}

module.exports = { promptJson };
