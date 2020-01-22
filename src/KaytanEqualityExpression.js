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

    executeLogic(scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return this.left.executeLogic(scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0)
            == this.right.value; 
    }
}

module.exports=KaytanEqualityExpression;
