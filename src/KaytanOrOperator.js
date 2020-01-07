var KaytanLogicToken=require('./KaytanLogicToken');
var KaytanOperator=require('./KaytanOperator');

class KaytanOrOperator extends KaytanOperator{
    constructor(left,right){
        super(left,right);
    }
}

module.exports=KaytanOrOperator;
