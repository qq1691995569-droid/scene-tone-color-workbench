const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const nodes={},calls=[];function node(id){return nodes[id]??=( {id,handlers:{},textContent:'',classList:{toggle(){},add(){},remove(){}},setAttribute(){},addEventListener(t,fn){this.handlers[t]=fn},after(el){nodes[el.id]=el},focus(){this.handlers.focus?.()},click(){},open:false} )}
for(const k of ['target','reference'])node(k).parentElement=node(k+'Stage');
const doc={handlers:{},createElement(){return node('temp'+Math.random())},addEventListener(t,fn){this.handlers[t]=fn}};
const context={document:doc,$:node,status:m=>calls.push(['status',m]),loadImage:(k,f)=>calls.push([k,f.name])};vm.createContext(context);
const source=fs.readFileSync('app.js','utf8');vm.runInContext(source.slice(source.indexOf("let importTarget='target'"),source.indexOf('function download(')),context);
const file={name:'sample.png',type:'image/png'},event={preventDefault(){},stopPropagation(){},target:{},clipboardData:{files:[file]}};
node('referenceStage').handlers.focus();doc.handlers.paste(event);assert.deepEqual(calls.pop(),['reference','sample.png']);
node('targetStage').handlers.drop({preventDefault(){},stopPropagation(){},dataTransfer:{files:[file]}});assert.deepEqual(calls.pop(),['target','sample.png']);
node('referenceStage').handlers.drop({preventDefault(){},stopPropagation(){},dataTransfer:{files:[file,file]}});assert.equal(calls.pop()[0],'status');
node('previewDialog').open=true;doc.handlers.paste(event);assert.equal(calls.length,0);
console.log('PASS: paste target selection, drop routing, multi-file rejection, modal guard');
