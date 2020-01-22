const KaytanBinaryExpression=require('./KaytanBinaryExpression');
const KaytanLiteral=require('./KaytanLiteral');
const Helper=require("./Helper");

class KaytanEqualityExpression extends KaytanBinaryExpression{
    constructor(engine,left,right){
        if (!(right instanceof KaytanLiteral))
            throw new TypeError('Right operand must be a KaytanLiteral'); 
        super(engine,left,'=',right);
        Object.defineProperties(this,{
            jsoperator:{ value:"==", writable:false }
        });        
    }

    executeLogic(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        let left=this.left.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0);
        if (left!=null)
            return left.value == this.right.value;
        else
            return false; 
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

module.exports=KaytanEqualityExpression;
