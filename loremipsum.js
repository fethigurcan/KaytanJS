Kaytan=require('.');

dd=new Kaytan("{{#a}}true{{:a}}false{{/a}}"
        ,{ optimized:true });
console.log(dd);

console.log(dd.ast.toString());
console.log(dd.execute({ a:true, b:true, c:true }));
console.log('end');
