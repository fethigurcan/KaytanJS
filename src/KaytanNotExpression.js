const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanExpression=require('./KaytanExpression');
const Helper=require('./Helper');

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
        let expression=this.expression.toString();
        if (Helper.checkRegexForExpressionToString.test(expression))
            expression="("+expression+")";

        return "!"+expression;
    }

    executeLogic(objectArray,parentIndex,parentLength){
        return !this.expression.executeLogic(objectArray,parentIndex,parentLength);
    }

    toJavascriptDefinitionsCode(){
        return this.expression.toJavascriptDefinitionsCode();
    }

    toJavascriptCheckCode(){
        let expression=this.expression.toJavascriptCheckCode();
        if (Helper.checkRegexForExpressionToString.test(expression))
            expression="("+expression+")";

        return "!"+expression;
    }
}

module.exports=KaytanNotExpression;
