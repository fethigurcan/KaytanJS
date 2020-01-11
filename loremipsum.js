Kaytan=require('.');

dd=new Kaytan("--{{#a}}{{#a}}{{#a}}{{.}},{{/}} ff {{#a}}{{.}},{{/}}{{/}}{{/}} {{#b}}{{#a}}{{#a}}{{.}},{{/}}{{/}}{{/}}--"
        ,{ optimized:true });
console.log(dd);

console.log(dd.ast.toString());
console.log(dd.execute({ "a":[
                {a:[{a:"a"},{a:"b"},{a:"c"}]},
                {a:[{a:"d"},{a:"e"},{a:"f"}]},
                {a:[{a:"g"},{a:"h"},{a:"i"}]},
                {a:[{a:"j"},{a:"k"},{a:"l"}]},
                {a:[{a:"m"},{a:"n"},{a:"o"}]}
        ],
        "b":[
            {a:[{a:"a"},{a:"b"},{a:"c"}]},
            {a:[{a:"d"},{a:"e"},{a:"f"}]},
            {a:[{a:"g"},{a:"h"},{a:"i"}]},
            {a:[{a:"j"},{a:"k"},{a:"l"}]},
            {a:[{a:"m"},{a:"n"},{a:"o"}]}
    ]    }));
console.log('end');
