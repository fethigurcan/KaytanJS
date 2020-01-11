const KaytanToken=require('./KaytanToken');
const partialsHolder=require('./Helper').partialsHolder;

class KaytanPartialDefinition extends KaytanToken{
    constructor(engine,name,token){
        if (!(token instanceof KaytanToken))
            throw new TypeError('token must be a KaytanToken');
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false },
            token:{ value:token, writable:false }
        });
    }

    toString(){
        return "{{<"+this.name+"}}"+this.token.toString()+"{{/}}";
    }

    execute(global,objectArray){
        if (!global[partialsHolder]) 
            global[partialsHolder]={};
        global[partialsHolder][this.name]=this.token;
        return '';
    }
}

module.exports=KaytanPartialDefinition;