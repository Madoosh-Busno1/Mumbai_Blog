// netlify/functions/delete-comment.js
//
// This serverless function lets the site owner delete inappropriate
// comments. It checks a secret admin password (set in Netlify's
// environment variables) before deleting anything, and uses the
// Supabase service role key (also kept secret on the server) to
// perform the deletion, since the public anon key used by the
// website itself is not allowed to delete rows.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  try {
    const { commentId, password } = JSON.parse(event.body);

    if (!commentId || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Missing comment ID or password." }),
      };
    }

    // Check the password against the secret set in Netlify environment variables
    if (password !== process.env.ADMIN_PASSWORD) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Incorrect admin password." }),
      };
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Server is not configured for deletion yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to Netlify environment variables." }),
      };
    }

    // Delete the comment using Supabase's REST API with the service role key,
    // which bypasses Row Level Security and is allowed to delete rows.
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/comments?id=eq.${encodeURIComponent(commentId)}`,
      {
        method: "DELETE",
        headers: {
          "apikey": SUPABASE_SERVICE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Supabase delete failed: ${response.status} ${errText}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("delete-comment function error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
