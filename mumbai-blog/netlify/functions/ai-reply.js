// netlify/functions/ai-reply.js
//
// This serverless function runs on Netlify's servers, not in the browser.
// It keeps your Anthropic API key secret by never sending it to visitors.
// Netlify calls this whenever someone posts a comment on a blog post.

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const { postTitle, commenterName, commentText } = JSON.parse(event.body);

    if (!postTitle || !commenterName || !commentText) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY, // loaded from Netlify environment variables
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system: `You are Medhansh Sharma, a passionate Mumbai-based history blogger. You write warm, knowledgeable, personal replies to reader comments on your blog posts about Mumbai's historically significant places. Your replies are 2-4 sentences, conversational, and engage specifically with what the reader said. You never write generic replies. You sometimes share an additional historical detail relevant to the conversation. Do not use markdown formatting or bullet points.`,
        messages: [
          {
            role: "user",
            content: `Blog post: "${postTitle}"\n\nComment from ${commenterName}: "${commentText}"\n\nWrite a warm, personal reply as Medhansh.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || null;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("ai-reply function error:", err);
    // Return success:false so the comment still saves even if AI reply fails
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply: null, error: err.message }),
    };
  }
};
