const KaytanBinaryExpression=require('./KaytanBinaryExpression');
const KaytanLiteral=require('./KaytanLiteral');
const Helper=require("./Helper");

class KaytanCompareExpression extends KaytanBinaryExpression{
    constructor(engine,left,operator,right){
        if (!(right instanceof KaytanLiteral))
            throw new TypeError('Right operand must be a KaytanLiteral'); 
        super(engine,left,operator,right);
        if (this.constructor===KaytanCompareExpression)
            throw new TypeError('Abstract class "KaytanCompareExpression" cannot be instantiated directly.'); 
    }

    toString(){
        let left=this.left.toString();
        let right=this.right.toString();

        if (Helper.expressionToStringParanthesisCheckerRegex.test(left))
            left="("+left+")";

        return left+this.operator+right;
    }

    toJavascriptDefinitionsCode(){
        let l=this.left.toJavascriptDefinitionsCode();
        return l;
    }

    toJavascriptCheckCode(){
        let left=this.left.toJavascriptAccessCode();
        let right=this.right.toJavascriptCode();

        if (Helper.expressionToStringParanthesisCheckerRegex.test(left))
            left="("+left+")";

        return left+this.jsoperator+right;
    }    
}

module.exports=KaytanCompareExpression;
