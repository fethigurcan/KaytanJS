const identifierRegexBaseStr="([a-zA-Z_][a-zA-Z0-9_]*|[0-9]+)";
const systemIdentifierRegexBaseStr="\\$(first|last|odd|even|intermediate|index|key)";
const identifierRegexStr=systemIdentifierRegexBaseStr+"|\\$"+identifierRegexBaseStr+"|(\\.)*"+identifierRegexBaseStr+"(\\."+identifierRegexBaseStr+")*";
const identifierRegex=new RegExp("^"+systemIdentifierRegexBaseStr+"$|^\\$"+identifierRegexBaseStr+"$|^(\\.)*"+identifierRegexBaseStr+"(\\."+identifierRegexBaseStr+")*$");
const simpleIdentifierRegex=new RegExp("^"+identifierRegexBaseStr+"$");
const arrayIndexRegex=/^[0-9]+$/;
const arrayAccessReplace=v=>v.replace(/\.[0-9]+/g,m=>"["+m.substring(1)+"]");
const partialsHolderName="$partials";
const expressionToStringParanthesisCheckerRegex=/[&|=]/;
const KaytanRuntimeError=require('./KaytanRuntimeError');
const KaytanSyntaxError=require('./KaytanSyntaxError');

const stringLiteralRegexStr="\"\"|''|\"(\\\\\"|((?!\").))*(\\\\\\\\\"|((?!\\\\).)\")|'(\\\\'|((?!').))*(\\\\\\\\'|((?!\\\\).)')";
const numberLiteralRegexStr="[0-9]+(\\.[0-9]*)?|\\.[0-9]+";
const binaryOperatorRegexStr="&|\\||=";
const unaryOperatorRegexStr="\\!";
const expressionRegexStr="(\\()|(\\))|("+binaryOperatorRegexStr+")|("+unaryOperatorRegexStr+")|("+identifierRegexStr+")|("+stringLiteralRegexStr+")|( +)";

const digitRegex=/^[0-9]$/;
const numberLiteralRegex=new RegExp(numberLiteralRegexStr);

const checkValue=v=>v!=null && v!==false && v!=="" && (!Array.isArray(v) || v.length>0); 


const htmlEscapeMap={
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#039;",
    "/":"&#x2F;"
};

const backslashEscapeMap={
    '"':'\\"',
    "'":"\\'",
    "`":"\\`",
    "\t":"\\t",    
    "\r":"\\r",    
    "\n":"\\n",    
    "\\":"\\\\"
};

const escapePrefixRegex=/^[&\\"'`[(\{]$/; // ['"` escape with doubling, \ escape C style, & raw data, {{noprefix}} default escape
const _escape={
    undefined: v=>v.replace(/[&<>"'\/]/g, m=>htmlEscapeMap[m]),
    "&": v=>v,
    "\\": v=>v.replace(/["'`\t\r\n\\]/g, m=>backslashEscapeMap[m]),
    '"': v=>v.replace(/"/g,'""'),
    "'": v=>v.replace(/'/g,"''"),
    "`": v=>v.replace(/`/g,'``'),
    "[": v=>v.replace(/]/g,']]'),
    "(": v=>v.replace(/\)/g,'\\)'),
    "{": v=>v.replace(/}/g,'\\}')
};
const escape=(v,e)=>v!=null?_escape[e](v.toString()):""

const systemIdentifierFn={
    first:(i,l)=>i===0?true:false,
    last:(i,l)=>i==l-1?true:false,
    intermediate:(i,l)=>i>0 && i<l-1?true:false,
    odd:(i,l)=>i%2==1?true:false,
    even:(i,l)=>i%2==0?true:false,
    index:(i)=>i,
    key:(i,l,k)=>k
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
    let dotMatches=_property.match(/\./g);
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
        access:_property,
        accessIndex:dotMatches?dotMatches.length:0
    };
}

const getPropertyValue=function(property,scopes,index,exactLevel){
    if (property=='.')
        return { value:scopes[scopes.length-1],scopes:scopes.slice(0,scopes.length-1) };

    let childIndex=property.indexOf('.');
    let _property=childIndex<0?property:property.substring(0,childIndex);

    let retVal={};
    if (exactLevel){
        retVal.scopes=scopes.slice(0,index+1);
        retVal.value=scopes[index][_property];
    }else 
        retVal=findPropertyValue(_property,scopes,index);

    if (childIndex<0)
        return retVal;
    else
        if (retVal.value!=null)
            return getPropertyValue(property.substring(childIndex+1),[...retVal.scopes,retVal.value],retVal.scopes.length,true);
        else
            throw new KaytanRuntimeError('object expected '+property);
};

const findPropertyValue=function(property,scopes,index){
    for (let i=index;i>-1;i--){
    //for (let i=scopes.length-1;i>-1;i--){        
        let p=scopes[i][property];
        if (p!=null){
             //if a property found but references to the current scope, stop searching upward to prevent cycle
            if (i<scopes.length && (p==scopes[i] || (Array.isArray(p) && p.indexOf(scopes[i])>-1 ))){
                debugger;
                return { scopes:scopes.slice(0,i+1) };
            }else
                return { value:p,scopes:scopes.slice(0,i+1) };
        }
    }
    return { scopes:scopes };
};

const accessToScopeArray=function(str){
    let i=str.indexOf(".");
    
    if (i<0)
        return [str];

    let retVal=[str.substring(0,i)];
    while ((i=str.indexOf(".",i+1))>-1)
        retVal.push(str.substring(0,i));

    return retVal;
}

module.exports={
    identifierRegex:identifierRegex,
    simpleIdentifierRegex:simpleIdentifierRegex,
    escapePrefixRegex:escapePrefixRegex,
    escape:escape,
    partialsHolderName:partialsHolderName,
    expressionToStringParanthesisCheckerRegex:expressionToStringParanthesisCheckerRegex,
    getPropertyValue:getPropertyValue,
    findPropertyValue:findPropertyValue,
    getScopeInfo:getScopeInfo,
    systemIdentifierFn:systemIdentifierFn,
    formatJavascript:formatJavascript,
    arrayIndexRegex:arrayIndexRegex,
    arrayAccessReplace:arrayAccessReplace,
    accessToScopeArray:accessToScopeArray,
    digitRegex:digitRegex,
    expressionRegexStr:expressionRegexStr,
    numberLiteralRegex:numberLiteralRegex,
    checkValue:checkValue
};