class KaytanError extends Error{
    constructor(message,index,src){        
        if (index!=null)
            message=message+' at template index '+index;
        if (src){
            message+="\n\n\t\t"+src.substr(index-25,50)+"\n\t\t"+" ".repeat(25)+"^";
        }      
        super(message);
        this.index=index;
        this.name=this.constructor.name;
    }
};

module.exports=KaytanError;