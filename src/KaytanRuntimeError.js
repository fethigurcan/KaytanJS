var KaytanError=require('./KaytanError');

class KaytanRuntimeError extends KaytanError{
    constructor(message,index,src){
        super(message,index,src);
    }      
};

module.exports=KaytanRuntimeError;
