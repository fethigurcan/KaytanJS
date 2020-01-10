var parseTemplate=require('./KaytanParserFn');
var KaytanTokenList=require('./KaytanTokenList');
var Helper=require('./Helper');

//for improve performance on execution (less conditions will be used in execute functions)
function prepareData(data){
    if (typeof(data)=="boolean")
        return data?true:null;
    else if (Array.isArray(data)){
        if (data.length){
            if (data.length==1)
                return prepareData(data[0]);
            else
                return data.map(i=>prepareData[i]);
        }else
            return null;
    }
    else if (typeof(data)=="object" && data){
        let keys=Object.keys(data);
        if (!keys)
            return null;
        else{
            let retVal={};
            for(let key of keys)
                retVal[key]=prepareData(data[key]);
            return retVal;
        }
    }
    else if (typeof(data)=="string")
        return data?data:null;
    else
        return data;
}

function _executeCompiledCode(values){
    return this.fn([{},prepareData(values)||{}]);
}

function _executeClassic(values){
    return this.ast.execute([{},prepareData(values)||{}]); //empty object is the global variable holder for define command
}

class Kaytan{
    constructor(template,options){
        Object.defineProperties(this,{
            template:{ value:template||'', writable:false, enumerable:true }
        });
        
        let ast=parseTemplate.call(this).data;
        ast=ast.length==1?ast[0]:new KaytanTokenList(this,ast);

        if (options && options.optimized){
            let fn=`let fn=function(objectArray){
                var retVal='';
                ${ast.toJavascriptCode()}
                return retVal;
            };fn;`;
            let getItem=Helper.getItem; //used inside fn, keep reference
            let _escape=Helper.escape; //used inside fn, keep reference
            fn=eval(fn);            
            Object.defineProperties(this,{
                fn:{ value:fn, writable:false },
                execute:{ value: _executeCompiledCode, writable:false }
            });
        }else{
            Object.defineProperties(this,{
                execute:{ value: _executeClassic, writable:false }
            });
        }

        Object.defineProperties(this,{
            ast:{ value:ast, writable:false, enumerable:true }
        });
    }
}

module.exports=Kaytan; 