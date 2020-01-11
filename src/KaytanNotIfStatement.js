const KaytanIfStatement=require('./KaytanIfStatement');

class KaytanNotIfStatement extends KaytanIfStatement{
    constructor(engine,_if,_then,_else){        
        super(engine,_if,_then,_else);
    }

    toString(){
        return "{{^"+super.toString().substring(3);
    }

    toJavascriptCode(ind){
        let nind=ind+"   ";
        let retVal=`${this.if.toJavascriptGetValueCode(ind)}
${ind}if (${this.if.toJavascriptCode(null)}==null){
${this.then.toJavascriptCode(nind)}${ind}}`;
        if (this.else)
            retVal+=`${ind}else{
${this.else.toJavascriptCode(nind)}${ind}}`;
        else
            retVal+=`
`;
        return retVal;
    }


    execute(objectArray,parentIndex,parentLength){
        if (!this.if.executeLogic(objectArray,parentIndex,parentLength))
            return this.then.execute(objectArray,parentIndex,parentLength);
        else if (this.else)
            return this.else.execute(objectArray,parentIndex,parentLength);
        else
            return '';
    }

}

module.exports=KaytanNotIfStatement;
