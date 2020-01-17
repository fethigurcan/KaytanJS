const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanBinaryExpression=require('./KaytanBinaryExpression');

class KaytanOrExpression extends KaytanBinaryExpression{
    constructor(engine,left,right){
        super(engine,left,'|',right);
        Object.defineProperties(this,{
            jsoperator:{ value:"||", writable:false }
        });        
    }

    executeLogic(scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return this.left.executeLogic(scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0) 
            || this.right.executeLogic(scopes,parentIndex,parentLength,parentKey,partialIndexAddition); 
    }
}

module.exports=KaytanOrExpression;
