const KaytanToken=require('./KaytanToken');
const KaytanStatement=require('./KaytanStatement');
const KaytanProperty=require('./KaytanProperty');
const formatJavascript=require('./Helper').formatJavascript;

class KaytanForStatement extends KaytanStatement{
    constructor(engine,_for,_loop,_else){        
        if (!(_for instanceof KaytanProperty))
            throw new TypeError('for statement must be a KaytanProperty'); 
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
        //let no=this.engine.varcounter;
        //this.engine.varcounter++;
        
        let retVal=`{
${formatJavascript(this.for.toJavascriptDefinitionsCode(),1)}
   let $arr=${this.for.toJavascriptAccessCode()};
   if ($o[$o.length-1]!=$arr){
      let $_o=$o;
      if (Array.isArray($arr) || ($arr!=null && $arr!==false && ($arr=[$arr]))){
         let $l=$arr.length;
         let $o=[...$_o,null];
         for(let $i=0;$i<$arr.length;$i++){
            let $scope=$arr[$i];
            $o[$o.length-1]=$scope;
${formatJavascript(this.loop.toJavascriptCode(),4)}
         }
      }`;
        if (this.else)
            retVal+=`else{
${formatJavascript(this.else.toJavascriptCode(),3)}
   }
}`;

        retVal+=`
   }
}`;
        return retVal;
    }

    execute(global,objectArray,parentIndex,parentLength,partialIndexAddition=0){
        let obj=this.for.execute(global,objectArray,parentIndex,parentLength,partialIndexAddition);
        let l=objectArray.length;

        if (objectArray[l-1]==obj)
            return ''; //prevents self recursion

        if (Array.isArray(obj) && obj.length){
            let childObjectArray=[...objectArray,null]; //son null oge her bir item ile değiştirilerek çalıştırılacak
            let s="";
            for (let i=0;i<obj.length;i++){
                childObjectArray[l]=obj[i]; //son öğe ile scope'u belirle.
                s+=this.loop.execute(global,childObjectArray,i,obj.length);
            }
            return s;
        }else if (obj)
            return this.loop.execute(global,[...objectArray,obj],0,1);
        else if (this.else)
            return this.else.execute(global,objectArray,parentIndex,parentLength,partialIndexAddition);
        else
            return '';
    }

}

module.exports=KaytanForStatement;
