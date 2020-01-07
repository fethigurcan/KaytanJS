var KaytanStatement=require('./KaytanStatement');
var KaytanToken=require('./KaytanToken');
var KaytanLogicToken=require('./KaytanLogicToken');

class KaytanIfStatement extends KaytanStatement{
    constructor(_if,_then,_else){        
        if (!(_if instanceof KaytanLogicToken))
            throw new TypeError('if statement must be a KaytanToken'); 
        if (!(_then instanceof KaytanToken))
            throw new TypeError('then statement must be a KaytanToken'); 
        if (!_else || !(_else instanceof KaytanToken))
            throw new TypeError('else statement must be a KaytanToken'); 
        super();
        this.if=_if;
        this.then=_then;
        this.else=_else;
    }
}

module.exports=KaytanIfStatement;