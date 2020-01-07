var KaytanError=require('./KaytanError');

class KaytanSyntaxError extends KaytanError{
    constructor(message,index,src){
        super(message,index,src);
    }      
};

module.exports=KaytanSyntaxError;
