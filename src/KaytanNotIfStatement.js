var KaytanIfStatement=require('./KaytanIfStatement');

class KaytanNotIfStatement extends KaytanIfStatement{
    constructor(_if,_then,_else){        
        super(_if,_then,_else);
    }
}

module.exports=KaytanNotIfStatement;
