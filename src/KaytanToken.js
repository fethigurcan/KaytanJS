class KaytanToken{
    constructor(engine){
        if (engine.constructor.name!="Kaytan") //text check to not reference from here
            throw new TypeError('engine must be a Kaytan instance'); 
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanToken" cannot be instantiated directly.');
        Object.defineProperties(this,{
            engine:{ value:engine, writable:false }
        });
    }

    getOutput(){
        throw new Error('getOutput method is not implemented.'); 
    }
}

module.exports=KaytanToken;