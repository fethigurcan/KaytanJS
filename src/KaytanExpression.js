var KaytanLogicToken=require('./KaytanLogicToken');

class KaytanExpression extends KaytanLogicToken{
    constructor(){
        super();
        if (this.constructor===KaytanExpression)
            throw new TypeError('Abstract class "KaytanExpression" cannot be instantiated directly.'); 
    }
}

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


class KaytanAndExpression extends KaytanOperator{
    constructor(left,right){
        super(left,right);
    }
}

class KaytanOrExpression extends KaytanOperator{
    constructor(left,right){
        super(left,right);
    }
}

class KaytanNotExpression extends KaytanExpression{
    constructor(expression){
        if (!(expression instanceof KaytanLogicToken))
            throw new TypeError('Expression must be a KaytanLogicToken'); 
        super();
        this.expression=expression;
    }
}

module.exports={
    KaytanExpression:KaytanExpression,
    KaytanOperator:KaytanOperator,
    KaytanAndExpression:KaytanAndExpression,
    KaytanOrExpression:KaytanOrExpression,
    KaytanNotExpression:KaytanNotExpression
};