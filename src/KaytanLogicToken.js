const KaytanToken=require('./KaytanToken');

class KaytanLogicToken extends KaytanToken{
    constructor(engine){
        super(engine);
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanLogicToken" cannot be instantiated directly.'); 
    }

    executeLogic(objectArray,parentIndex,parentLength){
        let retVal=this.execute(objectArray,parentIndex,parentLength);
        if (typeof(retVal)=="boolean")
            return retVal;
        else if (Array.isArray(retVal))
            return retVal.length>0;
        else if (typeof(retVal)=="string")
            return retVal!="";
        else
            return retVal!=null;
    }

}

module.exports=KaytanLogicToken;