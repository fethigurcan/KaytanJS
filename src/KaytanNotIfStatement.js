const KaytanIfStatement=require('./KaytanIfStatement');
const formatJavascript=require('./Helper').formatJavascript;

class KaytanNotIfStatement extends KaytanIfStatement{
    constructor(engine,_if,_then,_else){        
        super(engine,_if,_then,_else);
    }

    toString(){
        let s=this.engine.defaultStartDelimiter;
        return `${s}^${super.toString().substring(s.length+1)}`;
    }

    toJavascriptCode(){
        let retVal=`//{
${formatJavascript(this.if.toJavascriptDefinitionsCode(),1)}if (!${this.if.toJavascriptCheckCode()}){
${formatJavascript(this.then.toJavascriptCode(),2)}
   }`;
        if (this.else)
            retVal+=`else{
${formatJavascript(this.else.toJavascriptCode(),2)}
   }`;
        
        retVal+=`
//}
`;
        return retVal;
    }


    execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        if (!this.if.executeLogic(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0))
            return this.then.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        else if (this.else)
            return this.else.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        else
            return '';
    }

}

module.exports=KaytanNotIfStatement;
