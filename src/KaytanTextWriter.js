class KaytanTextWriter{
    constructor(){
        this._output='';
    }

    write(str){
        this._output+=str; 
    }

    toString(){
        return this._output;
    }
}

module.exports=KaytanTextWriter;