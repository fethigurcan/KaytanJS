const KaytanToken=require('./KaytanToken');
const partialsHolder=require('./Helper').partialsHolder;
const formatJavascript=require('./Helper').formatJavascript;

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
        let s=this.engine.defaultStartDelimiter;
        let e=this.engine.defaultEndDelimiter;
        return `${s}<${this.name}${e}${this.token.toString()}${s}/${e}`;
    }

    toJavascriptCode(){
        return `$global.${partialsHolder}.${this.name}=function($scope,$o,$pia) {
${formatJavascript(this.token.toJavascriptCode(),1)}
}`;
    }

    execute(global,objectArray){
        if (!global[partialsHolder]) 
            global[partialsHolder]={};
        global[partialsHolder][this.name]=this.token;
        return '';
    }
}

module.exports=KaytanPartialDefinition;