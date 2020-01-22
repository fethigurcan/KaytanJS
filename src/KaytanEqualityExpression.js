const KaytanBinaryExpression=require('./KaytanBinaryExpression');
const KaytanLiteral=require('./KaytanLiteral');

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
}

module.exports=KaytanEqualityExpression;
