const KaytanLogicToken=require('./KaytanLogicToken');
const KaytanRuntimeError=require('./KaytanRuntimeError');

//treat as static
const _getValueOf=function(property,objectArray,parentIndex,parentLength){
    if (property=='.')
        return objectArray[objectArray.length-1];

    let i=objectArray.length;
    let _property=property;
    while(_property[0]=='.'){
        i--;
        if (i<1)
            throw new KaytanRuntimeError('object tree mismatch for property '+property);
        _property=_property.substring(1);
    }
    let _objectArray;
    let _childIndex=_property.indexOf('.');
    let __property=_childIndex<0?_property:_property.substring(0,_childIndex);

    if (i<objectArray.length){ //exact level
        _objectArray=objectArray[i][__property];
    }else{ //search for all levels
        for (i=objectArray.length-1;i>-1;i--){
            _objectArray=objectArray[i][__property];
            if (_objectArray!=null){
                if (i<objectArray.length-1 && (_objectArray==objectArray[i+1] || (Array.isArray(_objectArray) && _objectArray.indexOf(objectArray[i+1])>-1 ))) //if a property found but references to the current scope, stop searching upward to prevent cycle
                    _objectArray=null;
                break;
            }
        }
    }

    if (_childIndex<0)
        return _objectArray;
    else
        if (_objectArray!=null && typeof(_objectArray)=='object')
            return _getValueOf(_property.substring(_childIndex),[...objectArray,_objectArray]);
        else
            throw new KaytanRuntimeError('object expected '+__property);
};

class KaytanProperty extends KaytanLogicToken{
    constructor(engine,name){
        super(engine);
        Object.defineProperties(this,{
            name:{ value:name, writable:false }
        });
    }

    toString(){
        return this.name;
    }

    execute(objectArray,parentIndex,parentLength){
        return _getValueOf(this.name,objectArray,parentIndex,parentLength); 
    }
}

module.exports=KaytanProperty;
