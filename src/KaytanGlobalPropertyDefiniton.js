const KaytanToken=require('./KaytanToken');

class KaytanGlobalPropertyDefinition extends KaytanToken{
    constructor(engine,name){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false }
        });
    }

    toString(){
        return "{{$"+this.name+"}}";
    }

    execute(objectArray){
        let rootObject=objectArray[0];
        rootObject[this.name]=true;
        return '';
    }

    toJavascriptCode(ind){
        return `${ind}$global$.${this.name}=true;
`;
    }
}

module.exports=KaytanGlobalPropertyDefinition;
