class KaytanTextWriter{
    constructor(){
        if (this.constructor===KaytanTextWriter)
            throw new TypeError('Abstract class "KaytanTextWriter" cannot be instantiated directly.');
    }
}


module.exports=KaytanTextWriter;