const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanOperator=require('./KaytanOperator');

class KaytanOrOperator extends KaytanOperator{
    constructor(engine,left,right){
        super(engine,left,'|',right);
    }

    executeLogic(objectArray,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return this.left.executeLogic(objectArray,parentIndex,parentLength,parentKey,partialIndexAddition=0) 
            || this.right.executeLogic(objectArray,parentIndex,parentLength,parentKey,partialIndexAddition); 
    }
}

module.exports=KaytanOrOperator;
