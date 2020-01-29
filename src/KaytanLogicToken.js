const KaytanToken=require('./KaytanToken');

class KaytanLogicToken extends KaytanToken{
    constructor(engine){
        super(engine);
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanLogicToken" cannot be instantiated directly.'); 
    }

    executeLogic(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        let r=this.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        return r.value!=null && r.value!==false && r.value!=="" && (!Array.isArray(r.value) || r.value.length>0);
    }
}

module.exports=KaytanLogicToken;