const KaytanProperty=require('./KaytanProperty');
const KaytanBugError=require('./KaytanBugError');
const Helper=require('./Helper');



class KaytanSystemProperty extends KaytanProperty{
    constructor(engine,name){
        super(engine,name,false);
        let fn=Helper.systemFn[this.name];
        if (fn){
          Object.defineProperties(this,{
            fn:{ value:fn, writable:false }
          });
        }else
          throw new KaytanBugError('Unknown system variable. '+this.name);

    }

    execute(global,objectArray,parentIndex,parentLength){
      return this.fn(parentIndex,parentLength);
    }

    toString(){
      let s=this.engine.defaultStartDelimiter;
      let e=this.engine.defaultEndDelimiter;
      return `${s}#${this.name}${e}`;
    }

    toJavascriptDefinitionsCode(){
        return "";
}

    toJavascriptAccessCode(){
        return `$systemFn["${this.name}"]($i,$l)`;
    }
}

module.exports=KaytanSystemProperty;
