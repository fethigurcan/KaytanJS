var KaytanIfStatement=require('./KaytanIfStatement');

class KaytanNotIfStatement extends KaytanIfStatement{
    constructor(engine,_if,_then,_else){        
        super(engine,_if,_then,_else);
    }

    toString(){
        return "{{^"+super.toString().substring(3);
    }
}

module.exports=KaytanNotIfStatement;
