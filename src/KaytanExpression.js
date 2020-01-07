var KaytanLogicToken=require('./KaytanLogicToken');

class KaytanExpression extends KaytanLogicToken{
    constructor(){
        super();
        if (this.constructor===KaytanExpression)
            throw new TypeError('Abstract class "KaytanExpression" cannot be instantiated directly.'); 
    }
}

module.exports=KaytanExpression;
