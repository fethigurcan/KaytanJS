var KaytanToken=require('./KaytanToken');

class KaytanLogicToken extends KaytanToken{
    constructor(engine){
        super(engine);
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanLogicToken" cannot be instantiated directly.'); 
    }
}

module.exports=KaytanLogicToken;