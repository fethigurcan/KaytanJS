const KaytanToken=require('./KaytanToken');

class KaytanLogicToken extends KaytanToken{
    constructor(engine){
        super(engine);
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanLogicToken" cannot be instantiated directly.'); 
    }

    executeLogic(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        let r=this.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        return r!=null && r!==false;
        /*let retVal=this.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        if (typeof(retVal)=="boolean")
            return retVal;
        else if (Array.isArray(retVal))
            return retVal.length>0;
        else if (typeof(retVal)=="string")
            return retVal!="";
        else
            return retVal!=null;*/
    }
}

module.exports=KaytanLogicToken;