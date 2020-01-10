Kaytan=require('.');

dd=new Kaytan("t{{?a}}a{{/}}m",{ optimized:true });
console.log(dd);
//dd.execute({ deneme: 'fethi' });

console.log(dd.ast.toString());
console.log(dd.execute({ "a":true }));
console.log('end');