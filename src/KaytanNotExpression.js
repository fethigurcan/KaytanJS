const KaytanUnaryExpression=require('./KaytanUnaryExpression');
const Helper=require('./Helper');

class KaytanNotExpression extends KaytanUnaryExpression{
    constructor(engine,argument){
        super(engine,argument,"!");
    }

    executeLogic(scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        return !this.argument.executeLogic(scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
    }

    toJavascriptCheckCode(){
        let argument=this.argument.toJavascriptCheckCode();
        if (Helper.expressionToStringParanthesisCheckerRegex.test(argument))
            argument="("+argument+")";

        return "!"+argument;
    }
}

module.exports=KaytanNotExpression;
