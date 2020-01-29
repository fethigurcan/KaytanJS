Kaytan=require('.');

dd=new Kaytan("{{?abc&b&c=\"deneme\"}}{{abc}}{{/}} {{{deneme}}}true"
        ,{ optimized:true,defaultStartDelimiter:'{{',defaultEndDelimiter:'}}' });
console.log(dd);

console.log(dd.ast.toString());
console.log(dd.execute({ abc:"selam",b:true,c:"deneme" }));
console.log('end');
