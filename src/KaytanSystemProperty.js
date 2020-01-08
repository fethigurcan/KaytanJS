const KaytanProperty=require('./KaytanProperty');
const KaytanBugError=require('./KaytanBugError');

class KaytanSystemProperty extends KaytanProperty{
    constructor(engine,name){
        super(engine,name);
    }

    execute(objectArray,parentIndex,parentLength){
        if (parentLength){ //system variable
            let retVal;
            if (this.name=="first")
              retVal=parentIndex===0;
            else if (this.name=="last")
              retVal=parentIndex==parentLength-1;
            else if (this.name=="intermediate")
              retVal=parentIndex>0 && parentIndex<parentLength-1;
            else if (this.name=="odd")
              retVal=parentIndex%2==1;
            else if (this.name=="even")
              retVal=parentIndex%2==0;
            else
              throw new KaytanBugError('Unknown system variable. '+this.name);
        
            return retVal;
        }
    }

}

module.exports=KaytanSystemProperty;
