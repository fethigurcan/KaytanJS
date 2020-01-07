var KaytanToken=require('./KaytanToken');
var KaytanStatement=require('./KaytanStatement');
var KaytanProperty=require('./KaytanProperty');

class KaytanForStatement extends KaytanStatement{
    constructor(_for,_loop,_else){        
        if (!(_for instanceof KaytanProperty))
            throw new TypeError('for statement must be a KaytanProperty'); 
        if (!(_loop instanceof KaytanToken))
            throw new TypeError('loop statement must be a KaytanToken'); 
        if (!_else || !(_else instanceof KaytanToken))
            throw new TypeError('else statement must be a KaytanToken'); 
        super();
        this.for=_for;
        this.loop=_loop;
        this.else=_else;
    }
}

module.exports=KaytanForStatement;
