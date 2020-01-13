const commandRegexBaseStr="[a-zA-Z_][a-zA-Z0-9_]*";
const commandNameRegex=new RegExp("^#(first|last|odd|even|intermediate)$|^\\$"+commandRegexBaseStr+"$|^(\\.)*"+commandRegexBaseStr+"(\\."+commandRegexBaseStr+")*$");
const simpleCommandNameRegex=new RegExp("^"+commandRegexBaseStr+"$");
const commandPrefixToken=/^[[('"`&\\]$/; // ['"` escape with doubling, \ escape C style, & raw data, {{noprefix}} default escape
const logicCommandPrefixToken=/^[?^]$/; //?=if, ^=not if 
const partialsHolder="$partials";
const checkRegexForExpressionToString=/[&|]/;
const KaytanRuntimeError=require('./KaytanRuntimeError');
const KaytanSyntaxError=require('./KaytanSyntaxError');

const escape={
    undefined: v=>v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\//g, "&#x2F;"),
    "&": v=>v,
    "\\": v=>v.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/'/g,"\\'").replace(/\t/g,'\\t').replace(/\r/g,'\\r').replace(/\n/g,'\\n'),
    "\"": v=>v.replace(/"/g,'""'),
    "'": v=>v.replace(/'/g,"''"),
    "`": v=>v.replace(/`/g,'``'),
    "[": v=>v.replace(/]/g,']]'),
    "(": v=>v.replace(/\)/g,'\\)')
    //"{": v=>v.replace(/}/g,'\\}')
};

const systemFn={
    first:(i,l)=>i===0?true:null,
    last:(i,l)=>i==l-1?true:null,
    intermediate:(i,l)=>i>0 && i<l-1?true:null,
    odd:(i,l)=>i%2==1?true:null,
    even:(i,l)=>i%2==0?true:null
};

const formatJavascript= (v,i) => v.replace(/^/gm," ".repeat(i*3));

const getScopeInfo=function(property,scopeInfo){
    if (property=='.')
        return scopeInfo[scopeInfo.length-1];

    let i=scopeInfo.length;
    let _property=property;
    while(_property[0]=='.'){
        i--;
        if (i<0)
            throw new KaytanSyntaxError('object tree mismatch for property '+property);
        _property=_property.substring(1);
    }
    let retVal;
    let _childIndex=_property.indexOf('.');
    let __property;
    if (_childIndex<0){
        __property=_property;
    }else{
        __property=_property.substring(0,_childIndex);
    }
    let exactLevel=false;
    let _scopeIndex;
    if (i<scopeInfo.length){
        exactLevel=true;
        _scopeIndex=i;
    }else{
        _scopeIndex=scopeInfo.length-1;
    }
    return {
        index:_scopeIndex,
        exactLevel:exactLevel,
        isCurrentScope:exactLevel&&(i==scopeInfo.length-1),
        name:__property,
        access:_property
    };
}

const getPropertyValue=function(property,objectArray,index,exactLevel){
    if (property=='.')
        return objectArray[objectArray.length-1];

    let childIndex=property.indexOf('.');
    let _property=childIndex<0?property:property.substring(0,childIndex);

    let retVal;
    if (exactLevel)
        retVal=objectArray[index][_property];
    else 
        retVal=findPropertyValue(_property,objectArray,index);

    if (childIndex<0)
        return retVal;
    else
        if (retVal!=null && typeof(retVal)=='object')
            return getPropertyValue(property.substring(childIndex+1),[...objectArray,retVal],objectArray.length,true);
        else
            throw new KaytanRuntimeError('object expected '+property);
};

const findPropertyValue=function(property,objectArray,index){
    for (let i=index;i>-1;i--){
        let p=objectArray[i][property];
        if (p!=null){
             //if a property found but references to the current scope, stop searching upward to prevent cycle
            if (i<objectArray.length && (p==objectArray[i] || (Array.isArray(p) && p.indexOf(objectArray[i])>-1 ))){
                return;
            }else
                return p;
        }
    }
};

module.exports={
    commandNameRegex:commandNameRegex,
    simpleCommandNameRegex:simpleCommandNameRegex,
    commandPrefixToken:commandPrefixToken,
    logicCommandPrefixToken:logicCommandPrefixToken,
    escape:escape,
    partialsHolder:partialsHolder,
    checkRegexForExpressionToString:checkRegexForExpressionToString,
    getPropertyValue:getPropertyValue,
    findPropertyValue:findPropertyValue,
    getScopeInfo:getScopeInfo,
    systemFn:systemFn,
    formatJavascript:formatJavascript
};