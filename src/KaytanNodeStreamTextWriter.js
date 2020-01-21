const KaytanTextWriter=require("./KaytanTextWriter");
const stream=require("stream");
class KaytanNodeStreamTextWriter extends KaytanTextWriter{
    constructor(writableStream){
        super();
        if (!(writableStream instanceof stream.Writable))
            throw new TypeError('writableStream must be a stream.Writable');

        this._stream=writableStream;
    }

    write(str){
        this._stream.write(str);
    };
    
    close(){
    };
    
}


module.exports=KaytanNodeStreamTextWriter;