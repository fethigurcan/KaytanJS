const KaytanTextWriter=require("./KaytanTextWriter");

class KaytanDefaultTextWriter extends KaytanTextWriter{
    constructor(){
        super();
        this._output='';
    }

    write(str){
        this._output+=str; 
    };
    
    toString(){
        return this._output;
    };
    
    close(){
    };
}


module.exports=KaytanDefaultTextWriter;