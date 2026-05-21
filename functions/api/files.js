export async function onRequest(context) {
  const { env } = context;
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  const objects = await env.INVOICE_BUCKET.list();
  const files = objects.objects.map(obj => ({
    key: obj.key,
    uploaded: obj.uploaded,
    size: obj.size,
    url: `${env.PUBLIC_BUCKET_URL}/${obj.key}`,
  }));

  return new Response(JSON.stringify(files), {
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}
