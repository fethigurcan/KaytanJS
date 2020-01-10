const KaytanToken=require('./KaytanToken');
const KaytanStatement=require('./KaytanStatement');
const KaytanProperty=require('./KaytanProperty');

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

    toJavascriptCode(indentation){
        let ind=indentation?"   ".repeat(indentation):"";
        let _for=this.for.toJavascriptCode();
        let retVal=`${ind}let ${_for}=getItem("${_for}");
${ind}if (Array.isArray(${_for})){
${ind}   for(let i=0;i<c.length;i++){
${ind}   let c=${_for}[i];
${this.loop.toJavascriptCode(indentation+1)}
${ind}}
${ind}}else if (${_for}){
${ind}   let c=${_for};
${this.loop.toJavascriptCode(indentation+1)}
${ind}}`;
        if (this.else)
            retVal+=`${ind}else{
${this.else.toJavascriptCode(indentation+1)}
${ind}}`;
        else
            retVal=`
`;
        return retVal;
    }

    execute(objectArray,parentIndex,parentLength){
        let obj=this.for.execute(objectArray,parentIndex,parentLength);

        if (Array.isArray(obj) && obj.length){
            let childObjectArray=[...objectArray,null]; //son null oge her bir item ile değiştirilerek çalıştırılacak
            let l=objectArray.length;
            let s="";
            for (let i=0;i<obj.length;i++){
                childObjectArray[objectArray.length]=obj[i]; //son öğe ile scope'u belirle.
                s+=this.loop.execute(childObjectArray,i,obj.length);
            }
            return s;
        }else if (obj)
            return this.loop.execute([...objectArray,obj],0,1);
        else if (this.else)
            return this.else.execute(objectArray,parentIndex,parentLength);
        else
            return '';
    }

}

module.exports=KaytanForStatement;
