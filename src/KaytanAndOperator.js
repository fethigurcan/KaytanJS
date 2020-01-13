const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanOperator=require('./KaytanOperator');

class KaytanAndOperator extends KaytanOperator{
    constructor(engine,left,right){
        super(engine,left,'&',right);
    }

    executeLogic(objectArray,parentIndex,parentLength,partialIndexAddition=0){
        return this.left.executeLogic(objectArray,parentIndex,parentLength,partialIndexAddition=0)
            && this.right.executeLogic(objectArray,parentIndex,parentLength,partialIndexAddition); 
    }
}

module.exports=KaytanAndOperator;
