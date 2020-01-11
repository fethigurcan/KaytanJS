Kaytan=require('.');

dd=new Kaytan("t{{?a.c&.b|!(c&d)}}a{{.a.b}}{{/}}m{{a}}{{#d}}{{/}}",{ optimized:true });
console.log(dd);
//dd.execute({ deneme: 'fethi' });

console.log(dd.ast.toString());
console.log(dd.execute({ "a":"a" }));
console.log('end');