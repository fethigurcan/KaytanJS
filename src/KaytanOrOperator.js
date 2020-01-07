var KaytanLogicToken=require('./KaytanLogicToken');
var KaytanOperator=require('./KaytanOperator');

class KaytanOrOperator extends KaytanOperator{
    constructor(engine,left,right){
        super(engine,left,'|',right);
    }
}

module.exports=KaytanOrOperator;
