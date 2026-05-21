export async function onRequest(context) {
  const { request, env, params } = context;
  const key = params.key;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const object = await env.INVOICE_BUCKET.get(key);
  if (!object) {
    return new Response("File not found", { status: 404 });
  }
  return new Response(object.body, {
    headers: { "Content-Type": object.httpMetadata?.contentType || "text/plain", ...corsHeaders },
  });
}
