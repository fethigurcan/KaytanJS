const KaytanStatement=require('./KaytanStatement');
const KaytanToken=require('./KaytanToken');
const KaytanLogicToken=require('./KaytanLogicToken');
const formatJavascript=require('./Helper').formatJavascript;

class KaytanIfStatement extends KaytanStatement{
    constructor(engine,_if,_then,_else){        
        if (!(_if instanceof KaytanLogicToken))
            throw new TypeError('if statement must be a KaytanToken'); 
        if (!(_then instanceof KaytanToken))
            throw new TypeError('then statement must be a KaytanToken'); 
        if (_else && !(_else instanceof KaytanToken))
            throw new TypeError('else statement must be a KaytanToken'); 
        super(engine);
        Object.defineProperties(this,{
            if:{ value:_if, writable:false },
            then:{ value:_then, writable:false },
            else:{ value:_else, writable:false }
        });
    }

    toString(){
        let s=this.engine.defaultStartDelimiter;
        let e=this.engine.defaultEndDelimiter;
        return `${s}#${this.if.toString()}${e}${this.then.toString()}${(this.else?`${s}:${e}`+this.else.toString():"")}${s}/${e}`;
    }

    toJavascriptCode(){
        let retVal=`//{
${formatJavascript(this.if.toJavascriptDefinitionsCode(),1)}if (${this.if.toJavascriptCheckCode()}){
${formatJavascript(this.then.toJavascriptCode(),2)}
   }`;
        if (this.else)
            retVal+=`else{
${formatJavascript(this.else.toJavascriptCode(),2)}
   }`;
        
        retVal+=`
//}`;
        return retVal;
    }

    execute(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        if (this.if.executeLogic(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition=0))
            return this.then.execute(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition);
        else if (this.else)
            return this.else.execute(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition);
        else
            return '';
    }

}

module.exports=KaytanIfStatement;