const KaytanProperty=require('./KaytanProperty');

class KaytanGlobalProperty extends KaytanProperty{
    constructor(engine,name){
        super(engine,name);
    }

    execute(objectArray,parentIndex,parentLength){
        let rootObject=objectArray[0];
        return rootObject[this.name];
    }

}

module.exports=KaytanGlobalProperty;
