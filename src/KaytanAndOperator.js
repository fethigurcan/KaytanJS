const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanOperator=require('./KaytanOperator');

class KaytanAndOperator extends KaytanOperator{
    constructor(engine,left,right){
        super(engine,left,'&',right);
    }

    executeLogic(objectArray,parentIndex,parentLength){
        return this.left.executeLogic(objectArray,parentIndex,parentLength)
            && this.right.executeLogic(objectArray,parentIndex,parentLength); 
    }
}

module.exports=KaytanAndOperator;
