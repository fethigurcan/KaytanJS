const KaytanIfStatement=require('./KaytanIfStatement');

class KaytanNotIfStatement extends KaytanIfStatement{
    constructor(engine,_if,_then,_else){        
        super(engine,_if,_then,_else);
    }

    toString(){
        return "{{^"+super.toString().substring(3);
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
