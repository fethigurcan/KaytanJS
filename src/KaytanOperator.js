const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanExpression=require('./KaytanExpression');
const Helper=require('./Helper');

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
        let left=this.left.toString();
        let right=this.right.toString();

        if (Helper.checkRegexForExpressionToString.test(left))
            left="("+left+")";

        if (Helper.checkRegexForExpressionToString.test(right))
            right="("+right+")";

        return left+this.operator+right;
    }

    toJavascriptGetValueCode(ind){
        let l=this.left.toJavascriptGetValueCode(ind);
        let r=this.right.toJavascriptGetValueCode(ind);
        return l+`
`+r;
    }

    toJavascriptCode(ind){
        let left=this.left.toJavascriptCode(ind);
        let right=this.right.toJavascriptCode(ind);

        if (Helper.checkRegexForExpressionToString.test(left))
            left="("+left+")";

        if (Helper.checkRegexForExpressionToString.test(right))
            right="("+right+")";

        return left+this.operator.repeat(2)+right;
    }

}

module.exports=KaytanOperator;
