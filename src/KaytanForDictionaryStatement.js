const KaytanToken=require('./KaytanToken');
const KaytanForStatement=require('./KaytanForStatement');
const KaytanProperty=require('./KaytanProperty');
const formatJavascript=require('./Helper').formatJavascript;

class KaytanForDictionaryStatement extends KaytanForStatement{
    constructor(engine,_for,_loop,_else){        
        super(engine,_for,_loop,_else);
    }

    toString(){
        let s=this.engine.defaultStartDelimiter;
        let e=this.engine.defaultEndDelimiter;
        return `${s}[${this.for.toString()}${e}${this.loop.toString()}${(this.else?`${s}:${e}`+this.else.toString():"")}${s}/${e}`;
    }

    toJavascriptCode(){
        let no=this.engine.varcounter;
        this.engine.varcounter++;
        
        let retVal=`//{
${formatJavascript(this.for.toJavascriptDefinitionsCode(),1)}let $obj${no}=${this.for.toJavascriptAccessCode()};
   if ($o[$o.length-1]!=$obj${no}){
      let $_o${no}=$o;
      let $keys;
      if (typeof($obj${no})=="object" && ($obj${no} && ($keys=Object.keys($obj${no})) && $keys.length)){
         let $l=$keys.length;
         let $o=[...$_o${no},null];
         for(let $i=0;$i<$keys.length;$i++){
            let $k=$keys[$i];
            let $scope=$obj${no}[$k];
            $o[$o.length-1]=$scope;
${formatJavascript(this.loop.toJavascriptCode(),4)}
         }
      }`;
        if (this.else)
            retVal+=`else{
${formatJavascript(this.else.toJavascriptCode(),3)}
   }
//}`;

        retVal+=`
   }
//}`;
        return retVal;
    }

    execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        let obj=this.for.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        let l=scopes.length;

        if (scopes[l-1]==obj)
            return ''; //prevents self recursion

        let keys;
        if (typeof(obj)=="object" && (obj && (keys=Object.keys(obj)) && keys.length)){
            let childscopes=[...scopes,null]; //son null oge her bir item ile değiştirilerek çalıştırılacak
            let s="";
            for (let i=0;i<keys.length;i++){
                childscopes[l]=obj[keys[i]]; //son öğe ile scope'u belirle.
                s+=this.loop.execute(global,childscopes,i,keys.length,keys[i],partialIndexAddition);
            }
            return s;
        }else if (this.else)
            return this.else.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        else
            return '';
    }

}

module.exports=KaytanForDictionaryStatement;