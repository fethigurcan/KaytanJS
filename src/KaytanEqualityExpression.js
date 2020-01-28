const KaytanCompareExpression=require('./KaytanCompareExpression');
const KaytanLiteral=require('./KaytanLiteral');
const Helper=require("./Helper");

class KaytanEqualityExpression extends KaytanCompareExpression{
    constructor(engine,left,right){
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
}

module.exports=KaytanEqualityExpression;
