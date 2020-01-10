const KaytanIfStatement=require('./KaytanIfStatement');

class KaytanNotIfStatement extends KaytanIfStatement{
    constructor(engine,_if,_then,_else){        
        super(engine,_if,_then,_else);
    }

    toString(){
        return "{{^"+super.toString().substring(3);
    }

    toJavascriptCode(indentation){
        let ind=indentation?"   ".repeat(indentation):"";
        let retVal=`${ind}${this.if.toJavascriptGetValueCode()}
${ind}if (${this.if.toJavascriptCode()}==null){
${ind}${this.then.toJavascriptCode(indentation+1)}
${ind}}`;
        if (this.else)
            retVal+=`${ind}else{
${ind}${this.else.toJavascriptCode(indentation+1)}
${ind}}`;
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
