const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const files={'/':'index.html','/index.html':'index.html','/app.js':'app.js','/color.js':'color.js','/preview.js':'preview.js'};
const port=8765,lanAddresses=Object.values(os.networkInterfaces()).flat().filter(x=>x?.family==='IPv4'&&!x.internal).map(x=>x.address),allowedHosts=new Set(['127.0.0.1','localhost',...lanAddresses]);
function requestHost(req){try{return new URL('http://'+req.headers.host).hostname}catch{return ''}}
http.createServer(async(req,res)=>{
res.setHeader('Cache-Control','no-store');
if(!allowedHosts.has(requestHost(req))){res.writeHead(403);return res.end('Forbidden')}
const pathname=new URL(req.url,'http://localhost').pathname;
const file=files[pathname];if(!file){res.writeHead(404);return res.end('Not found')}
res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript; charset=utf-8':'text/html; charset=utf-8');fs.createReadStream(path.join(__dirname,file)).pipe(res);
}).listen(port,'0.0.0.0',()=>console.log('Scene Tone: '+['http://127.0.0.1:'+port,...lanAddresses.map(ip=>'http://'+ip+':'+port)].join(' | ')));
