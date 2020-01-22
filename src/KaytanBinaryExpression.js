const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanExpression=require('./KaytanExpression');
const Helper=require('./Helper');

class KaytanBinaryExpression extends KaytanExpression{
    constructor(engine,left,operator,right){        
        if (!(left instanceof KaytanLogicToken))
            throw new TypeError('Left operand must be a KaytanLogicToken'); 
        super(engine);
        if (this.constructor===KaytanBinaryExpression)
            throw new TypeError('Abstract class "KaytanBinaryExpression" cannot be instantiated directly.'); 
        Object.defineProperties(this,{
            left:{ value:left, writable:false },
            operator:{ value:operator, writable:false },
            right:{ value:right, writable:false }
        });
    }
    
    toString(){
        let left=this.left.toString();
        let right=this.right.toString();

        if (Helper.expressionToStringParanthesisCheckerRegex.test(left))
            left="("+left+")";

        if (Helper.expressionToStringParanthesisCheckerRegex.test(right))
            right="("+right+")";

        return left+this.operator+right;
    }

    toJavascriptDefinitionsCode(){
        let l=this.left.toJavascriptDefinitionsCode();
        let r=this.right.toJavascriptDefinitionsCode();
        return l+r;
    }

    toJavascriptCheckCode(){
        let left=this.left.toJavascriptCheckCode();
        let right=this.right.toJavascriptCheckCode();

        if (Helper.expressionToStringParanthesisCheckerRegex.test(left))
            left="("+left+")";

        if (Helper.expressionToStringParanthesisCheckerRegex.test(right))
            right="("+right+")";

        return left+this.jsoperator+right;
    }

}

module.exports=KaytanBinaryExpression;
