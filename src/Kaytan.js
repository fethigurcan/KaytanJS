var KaytanRuntimeError=require('./KaytanRuntimeError');
var KaytanBugError=require('./KaytanBugError');
var Helper=require('./Helper');
var parseTemplate=require('./KaytanParserFn');
var KaytanTokenList=require('./KaytanTokenList');

//treat as static
const _getExistenceOf=function (property,objectArray,parentIndex,parentLength){
    let retVal=_getValueOf(property,objectArray,parentIndex,parentLength);
    if (typeof(retVal)=="boolean")
    return retVal;
    else if (Array.isArray(retVal))
    return retVal.length>0;
    else if (typeof(retVal)=="string")
    return retVal!="";
    else
    return retVal!=null;
};

//treat as static
const _getValueOf=function(property,objectArray,parentIndex,parentLength){
    if (property=='.')
    return objectArray[objectArray.length-1];

    if (property[0]=='#' && parentLength){ //system variable
    let _objectArray;
    if (property=="#first")
        _objectArray=parentIndex===0;
    else if (property=="#last")
        _objectArray=parentIndex==parentLength-1;
    else if (property=="#intermediate")
        _objectArray=parentIndex>0 && parentIndex<parentLength-1;
    else if (property=="#odd")
        _objectArray=parentIndex%2==1;
    else if (property=="#even")
        _objectArray=parentIndex%2==0;
    else
        throw new KaytanBugError('Unknown system variable. '+property);

    return _objectArray;
    }

    let i=objectArray.length;
    let _property=property;
    while(_property[0]=='.'){
    i--;
    if (i<0)
        throw new KaytanRuntimeError('object tree mismatch for property '+property);
    _property=_property.substring(1);
    }
    let _objectArray;
    let _childIndex=_property.indexOf('.');
    let __property=_childIndex<0?_property:_property.substring(0,_childIndex);

    if (i<objectArray.length){ //exact level
    _objectArray=objectArray[i][__property];
    }else{ //search for all levels
    for (i=objectArray.length-1;i>-1;i--){
        _objectArray=objectArray[i][__property];
        if (_objectArray){
        if (i<objectArray.length-1 && (_objectArray==objectArray[i+1] || (Array.isArray(_objectArray) && _objectArray.indexOf(objectArray[i+1])>-1 ))) //if a property found but references to the current scope, stop searching upward to prevent cycle
            _objectArray=null;
        break;
        }
    }
    }

    if (_childIndex<0)
    return _objectArray;
    else
    if (_objectArray && typeof(_objectArray)=='object')
        return _getValueOf(_property.substring(_childIndex),[...objectArray,_objectArray]);
    else
        throw new KaytanRuntimeError('object expected '+__property);
};

//treat as static
const _executeExpression=function(astItem,v,parentIndex,parentLength){
    if (typeof(astItem)=='string') //is a property
    return _getExistenceOf(astItem,v,parentIndex,parentLength);
    else if (astItem.operator){ //is a logic operation
    if (astItem.operator=='&')
        return _executeExpression(astItem.left,v,parentIndex,parentLength) && _executeExpression(astItem.right,v,parentIndex,parentLength);
    else if (astItem.operator=='|')
        return _executeExpression(astItem.left,v,parentIndex,parentLength) || _executeExpression(astItem.right,v,parentIndex,parentLength);
    else if (astItem.operator=='!')
        return !_executeExpression(astItem.expression,v,parentIndex,parentLength);
    else
        throw new KaytanBugError('Unknown expression operator. '+astItem.operator);
    }else
    throw new KaytanBugError('Unknown expression. '+astItem);
};

const _executeTemplate=function(astItem,v,parentIndex,parentLength){
    if (Array.isArray(astItem)){
    let s="";
    for (let i=0;i<astItem.length;i++)
        s+=_executeTemplate(astItem[i],v,parentIndex,parentLength);
    return s;
    }else if (typeof(astItem)=='string'){
    return astItem;
    }else if (astItem.if){
    if (_executeExpression(astItem.if,v,parentIndex,parentLength))
        return _executeTemplate(astItem.then,v,parentIndex,parentLength);
    else if (astItem.else)
        return _executeTemplate(astItem.else,v,parentIndex,parentLength);
    else
        return '';
    }else if (astItem.for){
        let obj=_getValueOf(astItem.for,v,parentIndex,parentLength);
        if (obj)
        if (Array.isArray(obj)){
            if (obj.length){
            let bv=[...v,null]; //son null oge her bir item ile değiştirilerek çalıştırılacak
            let l=v.length;
            let s="";
            for (let i=0;i<obj.length;i++){
                bv[v.length]=obj[i]; //son öğe ile scope'u belirle.
                s+=_executeTemplate(astItem.loop,bv,i,obj.length);
            }
            return s;
            }else if (astItem.else)
            return _executeTemplate(astItem.else,v,parentIndex,parentLength);
            else
            return '';  
        }else
            return _executeTemplate(astItem.loop,[...v,obj],parentIndex,parentLength);
        else if (astItem.else)
        return _executeTemplate(astItem.else,v,parentIndex,parentLength);
        else
        return '';
    }else if (astItem.value){
        let val=_getValueOf(astItem.value,v,parentIndex,parentLength);
        if (val)
        return Helper.escape[astItem.escape](val.toString());
        else
        return '';
    }else if (astItem['$']){
        //v[0] is always the global variable holder
        v[0][astItem['$']]=true;
        return '';
    }else if (astItem.partialdefinition){
        //v[0] is always the global variable holder
        if (!v[0]["$partials"]) v[0]["$partials"]={};
        v[0]["$partials"][astItem.partialdefinition]=astItem.data;
        return '';
    }else if (astItem.partial){
        //v[0] is always the global variable holder
        let partial=v[0]["$partials"] && v[0]["$partials"][astItem.partial];
        if (partial){
        return _executeTemplate(partial,v,parentIndex,parentLength);
        }
        throw new KaytanRuntimeError("Undefined partial:"+astItem.partial); 
    }else {
    return "?";
    }
};

class Kaytan{
    constructor(template,options){
        Object.defineProperties(this,{
            template:{ value:template, writable:false, enumerable:true }
        });
        
        let ast=parseTemplate.call(this).data;

        Object.defineProperties(this,{
            ast:{ value:ast.length==1?ast[0]:new KaytanTokenList(this,ast), writable:false, enumerable:true }
        });
    }
}


//private methods
Object.defineProperties(Kaytan.prototype,{
    execute:{
        value:function(values){
            return _executeTemplate(this.ast,[{},values]); //empty object is the global variable holder for define command
        },
        writable:false
    }
});

module.exports=Kaytan; 