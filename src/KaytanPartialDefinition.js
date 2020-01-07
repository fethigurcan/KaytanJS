var KaytanToken=require('./KaytanToken');

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
}

module.exports=KaytanPartialDefinition;