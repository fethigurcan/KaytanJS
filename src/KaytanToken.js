class KaytanToken{
    constructor(){
        if (this.constructor===KaytanToken)
            throw new TypeError('Abstract class "KaytanToken" cannot be instantiated directly.'); 
    }

    getOutput(){
        throw new Error('getOutput method is not implemented.'); 
    }
}

module.exports=KaytanToken;