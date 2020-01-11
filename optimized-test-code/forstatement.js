const Kaytan=require('../');
const Helper=require('../src/Helper');
const getItemSimple=Helper.getItemSimple;
const data={ "a":[
    {a:[{b:"a"},{b:"b"},{b:"c"}]},
    {a:[{b:"d"},{b:"e"},{b:"f"}]},
    {a:[{b:"g"},{b:"h"},{b:"i"}]},
    {a:[{b:"j"},{b:"k"},{b:"l"}]},
    {a:[{b:"m"},{b:"n"},{b:"o"}]}
]};

var kaytan=new Kaytan("t{{#a}}{{#a}}{{.b}},{{/}}{{/}}m",{ optimized:true });

var s=`
var _escape={
    undefined: v=>v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\\//g, "&#x2F;"),
    "&": v=>v,
    "\\\\": v=>v.replace(/\\\\/g,'\\\\\\\\').replace(/"/g,'\\\\"').replace(/'/g,"\\\\'").replace(/\\t/g,'\\\\t').replace(/\\r/g,'\\\\\\\\r').replace(/\\n/g,'\\\\n'),
    "\\"": v=>v.replace(/"/g,'""'),
    "'": v=>v.replace(/'/g,"''"),
    "[": v=>v.replace(/]/g,']]'),
    "(": v=>v.replace(/\\)/g,'\\\\)'),
    "{": v=>v.replace(/}/g,'\\\\}')
};
var systemFn={
    first:(i,l)=>i===0?true:null,
    last:(i,l)=>i==l-1?true:null,
    intermediate:(i,l)=>i>0 && i<l-1?true:null,
    odd:(i,l)=>i%2==1?true:null,
    even:(i,l)=>i%2==0?true:null
};
var getItemSimple=${getItemSimple.toString()};
var data=${JSON.stringify(data)};
var fn=${kaytan.fn.toString()}`
console.log(s);