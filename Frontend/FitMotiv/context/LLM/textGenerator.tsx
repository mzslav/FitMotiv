export const getAIAnswer = async (inp: string) => {
  let cont = ''
  if (inp === 'title') {
    cont = 'Respond only in JSON format. Do not use markdown, bolding, stars, underscores, or any formatting symbols. ' +
          'You are a title generator for an app where users send each other physical exercises. ' +
          'Generate exactly one (minimum 5 words), bold or playful challenge-style title in English. ' +
          'The title must be no more than 10 words. Do not include any specific actions or exercises. ' +
          'Output only a single JSON object in the format: {"title": "Your generated title here"}.';
  } else {
    cont = 'Respond only in JSON format. Do not use markdown, bolding, stars, underscores, or any formatting symbols. ' +
          'You are a message generator for an app where users send each other physical exercises. ' +
          'Generate exactly one (minimum 5 words), bold or playful challenge-style message for a friend in English. ' +
          'The text must be no more than 10 words. Do not include any specific actions or exercises. ' +
          'Output only a single JSON object in the format: {"title": "Your generated message here"}.';
  }
  
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat-v3-0324:free",
        messages: [
          {
            role: "user",
            content:
              `${cont}`,
          },
        ],
      }),
    }
  );

  const rawData = await response.json();
  let content = rawData.choices[0].message.content;

  if (content.startsWith("```")) {
    content = content.replace(/```json|```/g, "").trim();
  }

  try {
    const parsed = JSON.parse(content);
    return parsed.title;
  } catch (err) {
    console.error("Failed to parse AI response as JSON:", content);
  }

};
