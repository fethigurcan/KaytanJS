const KaytanTextWriter=require("./KaytanTextWriter");

class KaytanWritableStreamTextWriter extends KaytanTextWriter{
    constructor(writableStream){
        super();
        if (typeof WritableStream!=="undefined" && typeof TextEncoder!=="undefined"){

            if (!(writableStream instanceof WritableStream))
                throw new TypeError('writableStream must be a WritableStream');

            const decoder = new TextDecoder("utf-8");
            let me=this;
            me._output='';
            /*this._stream=new WritableStream({
                write(chunk) {
                  return new Promise((resolve, reject) => {
                    var buffer = new ArrayBuffer(1);
                    var view = new Int8Array(buffer);
                    view[0] = chunk;
                    var decoded = decoder.decode(view, { stream: true });
                    me._output+=decoded;
                    resolve();
                  });
                },
                close() {
                    console.log(me._output);
                },
                abort(err) {
                    console.log("Sink error:", err);
                }
              });*/
            this._stream=writableStream;
            this._writer=this._stream.getWriter();
            this._encoder = new TextEncoder();
        }else
            throw new Error("WritableStream is not supported.")
    }

    write(str){
        let encoded=this._encoder.encode(str);
        let writer=this._writer;
        encoded.forEach((chunk) => {
            writer.ready
                .then(() => {
                    return writer.write(chunk);
                })
                .then(() => {
                    //console.log("Chunk written to sink.");
                })
                .catch((err) => {
                    console.log("Chunk error:", err);
                });
        });    
    };
    
    close(){
        let writer=this._writer;
        writer.ready
            .then(() => {
                writer.close();
            })
            .then(() => {
                //console.log("All chunks written");
            })
            .catch((err) => {
                console.log("Stream error:", err);
            });
    };
    
}


module.exports=KaytanWritableStreamTextWriter;