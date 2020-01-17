const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanExpression=require('./KaytanExpression');
const Helper=require('./Helper');

class KaytanUnaryExpression extends KaytanExpression{
    constructor(engine,argument,operator){
        if (!(argument instanceof KaytanLogicToken))
            throw new TypeError('Expression must be a KaytanLogicToken'); 
        super(engine);
        Object.defineProperties(this,{
            argument:{ value:argument, writable:false },
            operator:{ value:operator, writable:false }
        });
    }

    toString(){
        let argument=this.argument.toString();
        if (Helper.expressionToStringParanthesisCheckerRegex.test(argument))
            argument="("+argument+")";

        return this.operator+argument;
    }

    toJavascriptDefinitionsCode(){
        return this.argument.toJavascriptDefinitionsCode();
    }

}

module.exports=KaytanUnaryExpression;
