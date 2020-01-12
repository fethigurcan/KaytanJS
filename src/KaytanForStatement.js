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
        return "{{#"+this.for.toString()+"}}"+this.loop.toString()+(this.else?"{{:}}"+this.else.toString():"")+"{{/}}";
    }

    toJavascriptCode(){
        let _for=this.for.toJavascriptCode();
        //let no=this.engine.varcounter;
        //this.engine.varcounter++;
        
        let retVal=`{
${formatJavascript(this.for.toJavascriptDefinitionsCode(),1)}
   let $arr=${_for};
   let $_o=$o;
   if (Array.isArray($arr) || ($arr!=null && $arr!==false && ($arr=[$arr]))){
      let $l=$arr.length;
      let $o=[...$_o,null];
      for(let $i=0;$i<$arr.length;$i++){
         let $scope=$arr[$i];
         $o[$o.length-1]=$scope;
${formatJavascript(this.loop.toJavascriptCode(),3)}
      }
   }`;
        if (this.else)
            retVal+=`else{
${formatJavascript(this.else.toJavascriptCode(),2)}
   }`;

        retVal+=`
}`;
        return retVal;
    }

    execute(global,objectArray,parentIndex,parentLength){
        let obj=this.for.execute(global,objectArray,parentIndex,parentLength);

        if (Array.isArray(obj) && obj.length){
            let childObjectArray=[...objectArray,null]; //son null oge her bir item ile değiştirilerek çalıştırılacak
            let l=objectArray.length;
            let s="";
            for (let i=0;i<obj.length;i++){
                childObjectArray[objectArray.length]=obj[i]; //son öğe ile scope'u belirle.
                s+=this.loop.execute(global,childObjectArray,i,obj.length);
            }
            return s;
        }else if (obj)
            return this.loop.execute(global,[...objectArray,obj],0,1);
        else if (this.else)
            return this.else.execute(global,objectArray,parentIndex,parentLength);
        else
            return '';
    }

}

module.exports=KaytanForStatement;
