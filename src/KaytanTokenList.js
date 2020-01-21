const KaytanToken=require('./KaytanToken');
const KaytanStringToken=require('./KaytanStringToken');

class KaytanTokenList extends KaytanToken{
    constructor(engine,tokens){
        if (!Array.isArray(tokens))
            throw new TypeError('tokens must be an Array');

        super(engine); 

        Object.defineProperties(this,{
            length:{ value:tokens.length, writable:false }
        });
        
        for(let i in tokens){
            if (typeof(tokens[i])=="string")
                tokens[i]=new KaytanStringToken(engine,tokens[i]);

            if (!(tokens[i] instanceof KaytanToken))
                throw new TypeError('all tokens must be a KaytanToken');
            else{
                Object.defineProperties(tokens[i],{
                    index:{ value:i, writable:false },
                    parent:this,
                });
                Object.defineProperties(this,{
                    [i]:{ value:tokens[i], writable:false }
                });
            }
        }
    }

    *[Symbol.iterator]() {
        for(let i=0;i<this.length;i++) 
            yield this[i];
    }

    toString(){
        let s='';
        for(let token of this) 
            s+=token.toString();
        return s;
    }

    toJavascriptCode(){
        let s="";
        for(let token of this) 
            s+=token.toJavascriptCode()+`
`;
        return s;
    }     

    execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition=0){
        for(let token of this) 
            token.execute(global,scopes,parentIndex,parentLength,parentKey,partialIndexAddition);
    }
}

module.exports=KaytanTokenList;