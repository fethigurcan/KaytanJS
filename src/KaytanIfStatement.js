var KaytanStatement=require('./KaytanStatement');
var KaytanToken=require('./KaytanToken');
var KaytanLogicToken=require('./KaytanLogicToken');

class KaytanIfStatement extends KaytanStatement{
    constructor(engine,_if,_then,_else){        
        if (!(_if instanceof KaytanLogicToken))
            throw new TypeError('if statement must be a KaytanToken'); 
        if (!(_then instanceof KaytanToken))
            throw new TypeError('then statement must be a KaytanToken'); 
        if (_else && !(_else instanceof KaytanToken))
            throw new TypeError('else statement must be a KaytanToken'); 
        super(engine);
        Object.defineProperties(this,{
            if:{ value:_if, writable:false },
            then:{ value:_then, writable:false },
            else:{ value:_else, writable:false }
        });
    }

    toString(){
        return "{{?"+this.if.toString()+"}}"+this.then.toString()+(this.else?"{{:}}"+this.else.toString():"")+"{{/}}";
    }

    toJavascriptCode(ind){
        let nind=ind+"   ";
        let retVal=`${ind}{
${this.if.toJavascriptGetValueCode(nind)}
${nind}if (${this.if.toJavascriptCode(null)}!=null){
${this.then.toJavascriptCode(nind+"   ")}${nind}}`;
        if (this.else)
            retVal+=`${nind}else{
${this.else.toJavascriptCode(nind+"   ")}${nind}}
${ind}}`;
        else
            retVal+=`${ind}}
`;
        return retVal;
    }

    execute(global,objectArray,parentIndex,parentLength){
        if (this.if.executeLogic(global,objectArray,parentIndex,parentLength))
            return this.then.execute(global,objectArray,parentIndex,parentLength);
        else if (this.else)
            return this.else.execute(global,objectArray,parentIndex,parentLength);
        else
            return '';
    }

}

module.exports=KaytanIfStatement;