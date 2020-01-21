const KaytanToken=require('./KaytanToken');
const KaytanStatement=require('./KaytanStatement');
const KaytanIdentifier=require('./KaytanIdentifier');
const formatJavascript=require('./Helper').formatJavascript;

class KaytanForStatement extends KaytanStatement{
    constructor(engine,_for,_loop,_else){        
        if (!(_for instanceof KaytanIdentifier))
            throw new TypeError('for statement must be a KaytanIdentifier'); 
        if (!(_loop instanceof KaytanToken))
            throw new TypeError('loop statement must be a KaytanToken'); 
        if (_else && !(_else instanceof KaytanToken))
            throw new TypeError('else statement must be a KaytanToken'); 
        super(engine);
        Object.defineProperties(this,{
            for:{ value:_for, writable:false },
            loop:{ value:_loop, writable:false },
            else:{ value:_else, writable:false }
        });
    }

    toString(){
        let s=this.engine.defaultStartDelimiter;
        let e=this.engine.defaultEndDelimiter;
        return `${s}#${this.for.toString()}${e}${this.loop.toString()}${(this.else?`${s}:${e}`+this.else.toString():"")}${s}/${e}`;
    }

    toJavascriptCode(){
        let no=this.engine.varcounter;
        this.engine.varcounter++;
        
        let retVal=`//{
${formatJavascript(this.for.toJavascriptDefinitionsCode(),1)}let $arr${no}=${this.for.toJavascriptAccessCode()};
   if ($o[$o.length-1]!=$arr${no}){
      let $_o${no}=${this.for.toJavascriptScopesCode()};
      let $_pia=$pia;
      if (Array.isArray($arr${no}) || ($arr${no}!=null && $arr${no}!==false && ($arr${no}=[$arr${no}]))){
        let $l=$arr${no}.length;
        let $o=[...$_o${no},null]; //TODO: single object scope is duplicated. fix it!
        let $pia=$l>1?$_pia+1:$_pia;
         
        for(let $i=0;$i<$arr${no}.length;$i++){
           let $k=$i;
           let $scope=$arr${no}[$i];
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
        let r=this.for.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        let obj=r.value;
        let l=r.scopes.length;

        if (scopes[scopes.length-1]==obj)
            return ''; //prevents self recursion

        if (Array.isArray(obj) && obj.length){
            let childscopes=[...r.scopes,null]; //son null oge her bir item ile değiştirilerek çalıştırılacak
            let s="";
            for (let i=0;i<obj.length;i++){
                childscopes[l]=obj[i]; //son öğe ile scope'u belirle.
                s+=this.loop.execute(global,childscopes,i,obj.length,i,partialIndexAddition);
            }
            return s;
        }else if (obj)
            return this.loop.execute(global,[...r.scopes,obj],0,1,0,partialIndexAddition);
        else if (this.else)
            return this.else.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
        else
            return '';
    }

}

module.exports=KaytanForStatement;
