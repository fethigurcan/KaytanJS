var KaytanToken=require('./KaytanToken');
var KaytanStatement=require('./KaytanStatement');
var KaytanProperty=require('./KaytanProperty');

class KaytanForStatement extends KaytanStatement{
    constructor(engine,_for,_loop,_else){        
        if (!(_for instanceof KaytanProperty))
            throw new TypeError('for statement must be a KaytanProperty'); 
        if (!(_loop instanceof KaytanToken))
            throw new TypeError('loop statement must be a KaytanToken'); 
        if (_else && !(_else instanceof KaytanToken))
            throw new TypeError('else statement must be a KaytanToken'); 
        super(engine);
        Object.defineProperties(this,{
            for:{ value:_for, writable:false },
            loop:{ value:_loop, writable:false },
            else:{ value:_else, writable:false }
        });
    }

    toString(){
        return "{{#"+this.for.toString()+"}}"+this.loop.toString()+(this.else?"{{:}}"+this.else.toString():"")+"{{/}}";
    }

}

module.exports=KaytanForStatement;
