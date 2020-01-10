const commandRegexBaseStr="[a-zA-Z_][a-zA-Z0-9-_]*";
const commandNameRegex=new RegExp("^#(first|last|odd|even|intermediate)$|^\\$"+commandRegexBaseStr+"$|^(\\.)*"+commandRegexBaseStr+"(\\."+commandRegexBaseStr+")*$");
const simpleCommandNameRegex=new RegExp("^"+commandRegexBaseStr+"$");
const commandPrefixToken=/^[[({'"`&\\]$/; // ['"` escape with doubling, \ escape C style, & raw data, {{noprefix}} default escape
const logicCommandPrefixToken=/^[?^]$/; //?=if, ^=not if 
const partialsHolder="$partials";
const checkRegexForExpressionToString=/[&|]/;

const escape={
    undefined: v=>v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\//g, "&#x2F;"),
    "&": v=>v,
    "\\": v=>v.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/'/g,"\\'").replace(/\t/g,'\\t').replace(/\r/g,'\\r').replace(/\n/g,'\\n'),
    "\"": v=>v.replace(/"/g,'""'),
    "'": v=>v.replace(/'/g,"''"),
    "`": v=>v.replace(/`/g,'``'),
    "[": v=>v.replace(/]/g,']]'),
    "(": v=>v.replace(/\)/g,'\\)'),
    "{": v=>v.replace(/}/g,'\\}')
};

const getItem=function(property,objectArray,parentIndex,parentLength){
    if (property=='.')
        return objectArray[objectArray.length-1];

    let i=objectArray.length;
    let _property=property;
    while(_property[0]=='.'){
        i--;
        if (i<1)
            throw new KaytanRuntimeError('object tree mismatch for property '+property);
        _property=_property.substring(1);
    }
    let retVal;
    let _childIndex=_property.indexOf('.');
    let __property=_childIndex<0?_property:_property.substring(0,_childIndex);

    if (i<objectArray.length){ //exact level
        retVal=objectArray[i][__property];
    }else{ //search for all levels
        for (i=objectArray.length-1;i>-1;i--){
            retVal=objectArray[i][__property];
            if (retVal!=null){
                if (i<objectArray.length-1 && (retVal==objectArray[i+1] || (Array.isArray(retVal) && retVal.indexOf(objectArray[i+1])>-1 ))) //if a property found but references to the current scope, stop searching upward to prevent cycle
                    retVal=null;
                break;
            }
        }
    }

    if (_childIndex<0)
        return retVal;
    else
        if (retVal!=null && typeof(retVal)=='object')
            return _getValueOf(_property.substring(_childIndex),[...objectArray,retVal]);
        else
            throw new KaytanRuntimeError('object expected '+__property);
};

module.exports={
    commandNameRegex:commandNameRegex,
    simpleCommandNameRegex:simpleCommandNameRegex,
    commandPrefixToken:commandPrefixToken,
    logicCommandPrefixToken:logicCommandPrefixToken,
    escape:escape,
    partialsHolder:partialsHolder,
    checkRegexForExpressionToString:checkRegexForExpressionToString,
    getItem:getItem
};