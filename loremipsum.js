Kaytan=require('.');

dd=new Kaytan("SELECT {{#hh}}{{?#first}}first{{/}} {{$hebele}} test,{{/}}FROM {{?$hebele}}hebele yaz{{/}} ({{(TableName}})"
        ,{ optimized:true });
console.log(dd);
//dd.execute({ deneme: 'fethi' });

console.log(dd.ast.toString());
console.log(dd.execute({ hh:[1,2,4],"TableName":"Employees (aka) Friends" }));
console.log('end');