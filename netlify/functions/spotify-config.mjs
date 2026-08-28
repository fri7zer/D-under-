export default async () => {
  const clientId = Netlify.env.get("SPOTIFY_CLIENT_ID") || "";
  const redirectUri = Netlify.env.get("SPOTIFY_REDIRECT_URI") || "";
  return new Response(JSON.stringify({clientId,redirectUri}), {headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store"}});
};
