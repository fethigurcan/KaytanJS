var KaytanLogicToken=require('./KaytanLogicToken');
var KaytanExpression=require('./KaytanExpression');

class KaytanNotExpression extends KaytanExpression{
    constructor(expression){
        if (!(expression instanceof KaytanLogicToken))
            throw new TypeError('Expression must be a KaytanLogicToken'); 
        super();
        this.expression=expression;
    }
}

module.exports=KaytanNotExpression;
