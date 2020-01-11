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
        let retVal=`${ind}{
${this.if.toJavascriptGetValueCode(nind)}
${nind}if (${this.if.toJavascriptCode(null)}==null){
${this.then.toJavascriptCode(nind+"   ")}${nind}}`;
        if (this.else)
            retVal+=`${nind}else{
${this.else.toJavascriptCode(nind+"   ")}${nind}}
${ind}}`;
        else
            retVal+=`${ind}}
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
