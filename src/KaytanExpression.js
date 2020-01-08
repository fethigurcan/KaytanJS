const KaytanLogicToken=require('./KaytanLogicToken');

class KaytanExpression extends KaytanLogicToken{
    constructor(engine){
        super(engine);
        if (this.constructor===KaytanExpression)
            throw new TypeError('Abstract class "KaytanExpression" cannot be instantiated directly.'); 
    }
}

module.exports=KaytanExpression;
