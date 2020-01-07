var KaytanLogicToken=require('./KaytanLogicToken');
var KaytanExpression=require('./KaytanExpression');

class KaytanNotExpression extends KaytanExpression{
    constructor(engine,expression){
        if (!(expression instanceof KaytanLogicToken))
            throw new TypeError('Expression must be a KaytanLogicToken'); 
        super(engine);
        Object.defineProperties(this,{
            expression:{ value:expression, writable:false }
        });
    }

    toString(){
        return "!("+this.expression.toString()+')';
    }
}

module.exports=KaytanNotExpression;
