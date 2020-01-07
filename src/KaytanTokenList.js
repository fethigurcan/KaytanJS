var KaytanToken=require('./KaytanToken');

class KaytanTokenList extends KaytanToken{
    constructor(engine,tokens){
        if (!Array.isArray(tokens))
            throw new TypeError('tokens must be an Array');

        super(engine); 

        Object.defineProperties(this,{
            length:{ value:tokens.length, writable:false }
        });
        
        for(let i in tokens) 
            if (!(tokens[i] instanceof KaytanToken))
                throw new TypeError('all tokens must be a KaytanToken');
            else
                Object.defineProperties(this,{
                    [i]:{ value:tokens[i], writable:false }
                });
    }

    *[Symbol.iterator]() {
        for(let i=0;i<this.length;i++) 
            yield this[i];
    }

    get length(){
        return this.tokens.length;
    }

    toString(){
        let s='';
        for(let token of this) 
            s+=token.toString();
        return s;
    }

}

module.exports=KaytanTokenList;