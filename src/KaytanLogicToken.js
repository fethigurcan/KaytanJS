const KaytanToken=require('./KaytanToken');
const Helper=require('./Helper');

class KaytanLogicToken extends KaytanToken{
    constructor(engine){
        super(engine);
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanLogicToken" cannot be instantiated directly.'); 
    }

    executeLogic(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        let r=this.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        return Helper.checkValue(r.value);
    }
}

module.exports=KaytanLogicToken;