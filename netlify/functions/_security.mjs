import crypto from 'node:crypto';
export const json=(body,status=200,headers={})=>Response.json(body,{status,headers:{'Cache-Control':'no-store',...headers}});
export const methodAllowed=(request,methods)=>methods.includes(request.method);
export const readCookie=(request,name)=>(request.headers.get('cookie')||'').split(';').map(value=>value.trim()).find(value=>value.startsWith(`${name}=`))?.slice(name.length+1);
export const cookie=(name,value,maxAge)=>`${name}=${value}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;
function sessionKey(){const secret=process.env.DUNDER_SESSION_SECRET;if(!secret||secret.length<32)throw new Error('session_configuration');return crypto.createHash('sha256').update(secret).digest()}
export function sealSession(payload){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',sessionKey(),iv),encrypted=Buffer.concat([cipher.update(JSON.stringify(payload),'utf8'),cipher.final()]),tag=cipher.getAuthTag();return Buffer.concat([iv,tag,encrypted]).toString('base64url')}
export function openSession(value){const bytes=Buffer.from(value,'base64url');if(bytes.length<29)throw new Error('invalid_session');const iv=bytes.subarray(0,12),tag=bytes.subarray(12,28),encrypted=bytes.subarray(28),decipher=crypto.createDecipheriv('aes-256-gcm',sessionKey(),iv);decipher.setAuthTag(tag);return JSON.parse(Buffer.concat([decipher.update(encrypted),decipher.final()]).toString('utf8'))}
export function safeOrigin(request){const origin=new URL(request.url).origin,configured=process.env.DUNDER_PUBLIC_ORIGIN;if(configured&&origin!==new URL(configured).origin)throw new Error('invalid_origin');return configured?new URL(configured).origin:origin}
