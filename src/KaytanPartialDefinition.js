const KaytanToken=require('./KaytanToken');
const partialsHolderName=require('./Helper').partialsHolderName;
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
        return `$global.${partialsHolderName}.${this.name}=function($scope,$o,$pia,$i,$l) {
${formatJavascript(this.token.toJavascriptCode(),1)}
}`;
    }

    execute(global,scopes){
        if (!global[partialsHolderName]) 
            global[partialsHolderName]={};
        global[partialsHolderName][this.name]=this.token;
        return '';
    }
}

module.exports=KaytanPartialDefinition;