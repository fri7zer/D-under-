import crypto from "node:crypto";
const COOKIE="dunder_spotify",STATE="dunder_spotify_state";
const env=k=>Netlify.env.get(k)||"";
const base64url=v=>Buffer.from(v).toString("base64url");
const parseCookies=req=>Object.fromEntries((req.headers.get("cookie")||"").split(";").map(x=>x.trim().split("=")).filter(x=>x[0]).map(([k,...v])=>[k,decodeURIComponent(v.join("="))]));
const cookie=(name,value,maxAge)=>name+"="+encodeURIComponent(value)+"; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age="+maxAge;
const redirect=(url,cookies=[])=>new Response(null,{status:302,headers:{location:url,"set-cookie":cookies}});
const json=(data,status=200,cookies=[])=>{const h=new Headers({"content-type":"application/json; charset=utf-8","cache-control":"no-store"});cookies.forEach(c=>h.append("set-cookie",c));return new Response(JSON.stringify(data),{status,headers:h})};
const pack=x=>base64url(JSON.stringify(x));
const unpack=x=>{try{return JSON.parse(Buffer.from(x,"base64url").toString())}catch{return null}};
async function tokenRequest(body){const id=env("SPOTIFY_CLIENT_ID"),secret=env("SPOTIFY_CLIENT_SECRET");if(!id||!secret)throw new Error("Spotify non configuré");return fetch("https://accounts.spotify.com/api/token",{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded",authorization:"Basic "+Buffer.from(id+":"+secret).toString("base64")},body:new URLSearchParams(body)})}
async function validSession(req){const session=unpack(parseCookies(req)[COOKIE]);if(!session)return{session:null,cookies:[]};if(session.expires>Date.now()+30000)return{session,cookies:[]};if(!session.refresh)return{session:null,cookies:[cookie(COOKIE,"",0)]};const r=await tokenRequest({grant_type:"refresh_token",refresh_token:session.refresh});if(!r.ok)return{session:null,cookies:[cookie(COOKIE,"",0)]};const t=await r.json(),next={access:t.access_token,refresh:t.refresh_token||session.refresh,expires:Date.now()+t.expires_in*1000};return{session:next,cookies:[cookie(COOKIE,pack(next),2592000)]}}
export default async req=>{
 const u=new URL(req.url),action=u.searchParams.get("action")||"status",home=env("SITE_URL")||"https://rainbow-kelpie-d8b8ac.netlify.app/",callback=env("SPOTIFY_REDIRECT_URI")||new URL("/.netlify/functions/spotify?action=callback",home).href;
 try{
  if(action==="login"){const id=env("SPOTIFY_CLIENT_ID");if(!id)return json({error:"SPOTIFY_CLIENT_ID manquant"},503);const state=crypto.randomBytes(24).toString("hex"),p=new URLSearchParams({client_id:id,response_type:"code",redirect_uri:callback,state,scope:"user-read-private user-read-email"});return redirect("https://accounts.spotify.com/authorize?"+p,[cookie(STATE,state,600)])}
  if(action==="callback"){const expected=parseCookies(req)[STATE],state=u.searchParams.get("state"),code=u.searchParams.get("code");if(!expected||expected!==state||!code)return redirect(home+"?spotify=error",[cookie(STATE,"",0)]);const r=await tokenRequest({grant_type:"authorization_code",code,redirect_uri:callback});if(!r.ok)return redirect(home+"?spotify=error",[cookie(STATE,"",0)]);const t=await r.json(),session={access:t.access_token,refresh:t.refresh_token,expires:Date.now()+t.expires_in*1000};return redirect(home+"?spotify=connected",[cookie(COOKIE,pack(session),2592000),cookie(STATE,"",0)])}
  if(action==="logout")return json({ok:true},200,[cookie(COOKIE,"",0)]);
  const s=await validSession(req);if(!s.session)return json({connected:false},401,s.cookies);
  if(action==="me"){const r=await fetch("https://api.spotify.com/v1/me",{headers:{authorization:"Bearer "+s.session.access}});return json(r.ok?{connected:true,profile:await r.json()}:{connected:false},r.ok?200:r.status,s.cookies)}
  if(action==="search"){const q=(u.searchParams.get("q")||"").slice(0,180);if(!q)return json({error:"Requête manquante"},400,s.cookies);const r=await fetch("https://api.spotify.com/v1/search?type=track&limit=8&q="+encodeURIComponent(q),{headers:{authorization:"Bearer "+s.session.access}});return json(r.ok?await r.json():{error:"Spotify indisponible"},r.status,s.cookies)}
  return json({connected:true},200,s.cookies);
 }catch(e){return json({error:e.message||"Erreur Spotify"},500)}
};
