const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanExpression=require('./KaytanExpression');

class KaytanOperator extends KaytanExpression{
    constructor(engine,left,operator,right){        
        if (!(left instanceof KaytanLogicToken))
            throw new TypeError('Left operand must be a KaytanLogicToken'); 
        if (!(right instanceof KaytanLogicToken))
            throw new TypeError('Right operand must be a KaytanLogicToken'); 
        super(engine);
        if (this.constructor===KaytanOperator)
            throw new TypeError('Abstract class "KaytanOperator" cannot be instantiated directly.'); 
        Object.defineProperties(this,{
            left:{ value:left, writable:false },
            operator:{ value:operator, writable:false },
            right:{ value:right, writable:false }
        });
    }
    
    toString(){
        return "("+this.left.toString()+")"+this.operator+"("+this.right.toString()+")";
    }
}

module.exports=KaytanOperator;
