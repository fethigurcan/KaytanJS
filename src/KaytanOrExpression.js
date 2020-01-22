const KaytanBinaryExpression=require('./KaytanBinaryExpression');
const KaytanLogicToken=require('./KaytanLogicToken');

class KaytanOrExpression extends KaytanBinaryExpression{
    constructor(engine,left,right){
        if (!(right instanceof KaytanLogicToken))
            throw new TypeError('Right operand must be a KaytanLogicToken'); 

        super(engine,left,'|',right);
        Object.defineProperties(this,{
            jsoperator:{ value:"||", writable:false }
        });        
    }

    executeLogic(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return this.left.executeLogic(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0) 
            || this.right.executeLogic(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition); 
    }
}

module.exports=KaytanOrExpression;
