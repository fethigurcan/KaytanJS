const commandRegexBaseStr="[a-zA-Z_][a-zA-Z0-9-_]*";
const commandNameRegex=new RegExp("^#(first|last|odd|even|intermediate)$|^\\$"+commandRegexBaseStr+"$|^(\\.)*"+commandRegexBaseStr+"(\\."+commandRegexBaseStr+")*$");
const simpleCommandNameRegex=new RegExp("^"+commandRegexBaseStr+"$");
const commandPrefixToken=/^[[({'"`&\\]$/; // ['"` escape with doubling, \ escape C style, & raw data, {{noprefix}} default escape
const logicCommandPrefixToken=/^[?^]$/; //?=if, ^=not if 
const partialsHolder="$partials";

const escape={
    undefined: function(v){
    return v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\//g, "&#x2F;");
    },
    "\\": function(v){
    return v.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/'/g,"\\'").replace(/\t/g,'\\t').replace(/\r/g,'\\r').replace(/\n/g,'\\n');
    },
    "\"": function(v){
    return v.replace(/"/g,'""');
    },
    "'": function(v){
    return v.replace(/'/g,"''");
    },
    "[": function(v){
    return v.replace(/]/g,']]');
    },
    "(": function(v){
    return v.replace(/\)/g,'\\)');
    },
    "{": function(v){
    return v.replace(/}/g,'}}');
    },
    "`": function(v){
    return v.replace(/`/g,'``');;
    },
    "&": function(v){
    return v;
    }
};

module.exports={
    commandNameRegex:commandNameRegex,
    simpleCommandNameRegex:simpleCommandNameRegex,
    commandPrefixToken:commandPrefixToken,
    logicCommandPrefixToken:logicCommandPrefixToken,
    escape:escape,
    partialsHolder:partialsHolder
};