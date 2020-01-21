const KaytanIdentifier=require('./KaytanIdentifier');
const KaytanBugError=require('./KaytanBugError');
const Helper=require('./Helper');



class KaytanSystemIdentifier extends KaytanIdentifier{
    constructor(engine,name){
        super(engine,name,false);
        let fn=Helper.systemIdentifierFn[this.name];
        if (fn){
          Object.defineProperties(this,{
            fn:{ value:fn, writable:false }
          });
        }else
          throw new KaytanBugError('Unknown system variable. '+this.name);

    }

    execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
      return { value:this.fn(parentIndex,parentLength,parentKey) };
    }

    toString(){
      let s=this.engine.defaultStartDelimiter;
      let e=this.engine.defaultEndDelimiter;
      return `${s}$${this.name}${e}`;
    }

    toJavascriptDefinitionsCode(){
        return "";
}

    toJavascriptAccessCode(){
        return `$systemIdentifierFn["${this.name}"]($i,$l,$k)`;
    }
}

module.exports=KaytanSystemIdentifier;
