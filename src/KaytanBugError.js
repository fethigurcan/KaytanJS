const KaytanError=require('./KaytanError');

class KaytanBugError extends KaytanError{
    constructor(message,index,src){
        super(message,index,src);
    }      
};

module.exports=KaytanBugError;
