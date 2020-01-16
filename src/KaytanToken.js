class KaytanToken{
    constructor(engine){
        //if (engine.constructor.name!="Kaytan") //text check to not reference from here
        //    throw new TypeError('engine must be a Kaytan instance'); 
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanToken" cannot be instantiated directly.');
        Object.defineProperties(this,{
            engine:{ value:engine, writable:false }
        });
    }

    execute(global,objectArray,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        throw new Error('execute method is not implemented for:'+this.constructor.name); 
    }
}

module.exports=KaytanToken;