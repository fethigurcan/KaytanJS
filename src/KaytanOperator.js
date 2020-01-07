var KaytanLogicToken=require('./KaytanLogicToken');
var KaytanExpression=require('./KaytanExpression');

class KaytanOperator extends KaytanExpression{
    constructor(left,right){        
        if (!(left instanceof KaytanLogicToken))
            throw new TypeError('Left operand must be a KaytanLogicToken'); 
        if (!(right instanceof KaytanLogicToken))
            throw new TypeError('Right operand must be a KaytanLogicToken'); 
        super();
        this.left=left;
        this.right=right;
        if (this.constructor===KaytanOperator)
            throw new TypeError('Abstract class "KaytanOperator" cannot be instantiated directly.'); 
    }
}

module.exports=KaytanOperator;
