const KaytanToken=require('./KaytanToken');

class KaytanStatement extends KaytanToken{
    constructor(engine){
        super(engine);
        if (this.constructor===KaytanStatement)
            throw new TypeError('Abstract class "KaytanStatement" cannot be instantiated directly.'); 
    }
}

module.exports=KaytanStatement;
