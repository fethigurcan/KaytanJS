const KaytanIfStatement=require('./KaytanIfStatement');
const formatJavascript=require('./Helper').formatJavascript;

class KaytanNotIfStatement extends KaytanIfStatement{
    constructor(engine,_if,_then,_else){        
        super(engine,_if,_then,_else);
    }

    toString(){
        return "{{^"+super.toString().substring(3);
    }

    toJavascriptCode(){
        let retVal=`{
${formatJavascript(this.if.toJavascriptGetValueCode(),1)}
    if (${this.if.toJavascriptCode()}==null){
${formatJavascript(this.then.toJavascriptCode(),2)}
   }`;
        if (this.else)
            retVal+=`else{
${formatJavascript(this.else.toJavascriptCode(),1)}
   }`;
        
        retVal+=`
}
`;
        return retVal;
    }


    execute(global,objectArray,parentIndex,parentLength){
        if (!this.if.executeLogic(global,objectArray,parentIndex,parentLength))
            return this.then.execute(global,objectArray,parentIndex,parentLength);
        else if (this.else)
            return this.else.execute(global,objectArray,parentIndex,parentLength);
        else
            return '';
    }

}

module.exports=KaytanNotIfStatement;
