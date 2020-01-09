Kaytan=require('.');

dd=new Kaytan("{{?a}}true{{:}}false{{/}}");
console.log(dd);
//dd.execute({ deneme: 'fethi' });

console.log(dd.ast.toString());
console.log(dd.execute({ "a":0 }));
console.log('end');