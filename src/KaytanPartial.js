const KaytanToken=require('./KaytanToken');
const partialsHolder=require('./Helper').partialsHolder;

class KaytanPartial extends KaytanToken{
    constructor(engine,name){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false }
        });
    }

    toString(){
        return "{{>"+this.name.toString()+"}}";
    }

    execute(objectArray,parentIndex,parentLength){
        let rootObject=objectArray[0][partialsHolder];
        let partial=rootObject && rootObject[this.name];
        if (partial)
            return partial.execute(objectArray,parentIndex,parentLength);
    }

}

module.exports=KaytanPartial;