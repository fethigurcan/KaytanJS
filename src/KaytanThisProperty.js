const KaytanProperty=require('./KaytanProperty');

class KaytanThisProperty extends KaytanProperty{
    constructor(engine){
        super(engine,'.');
    }

    execute(objectArray,parentIndex,parentLength){
        return objectArray[objectArray.length-1];
    }

}

module.exports=KaytanThisProperty;
