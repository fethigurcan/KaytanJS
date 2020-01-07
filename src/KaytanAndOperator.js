var KaytanLogicToken=require('./KaytanLogicToken');
var KaytanOperator=require('./KaytanOperator');

class KaytanAndOperator extends KaytanOperator{
    constructor(left,right){
        super(left,'&',right);
    }
}

module.exports=KaytanAndOperator;
