export async function onRequest(context) {
  const { request, env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file || !file.name.endsWith('.txt')) {
      return new Response(JSON.stringify({ error: "Hanya file .txt" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${timestamp}_${safeName}`;

    await env.INVOICE_BUCKET.put(key, file.stream(), {
      httpMetadata: { contentType: file.type || "text/plain" },
    });

    const publicUrl = `${env.PUBLIC_BUCKET_URL}/${key}`;

    return new Response(JSON.stringify({ success: true, key, publicUrl }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
