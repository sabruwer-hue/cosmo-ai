/* Cosmo Formula Engine — safe, bounded browser prototype.
 * No eval/Function, network, storage, or arbitrary code execution.
 * Prototype only: not a certified scientific or engineering solver.
 */
(function (root) {
  "use strict";
  const UNITS = {
    "1": { scale: 1, dims: [0,0,0,0,0,0,0] },
    m: { scale: 1, dims: [0,1,0,0,0,0,0] },
    cm: { scale: .01, dims: [0,1,0,0,0,0,0] },
    km: { scale: 1000, dims: [0,1,0,0,0,0,0] },
    mm: { scale: .001, dims: [0,1,0,0,0,0,0] },
    s: { scale: 1, dims: [0,0,1,0,0,0,0] },
    min: { scale: 60, dims: [0,0,1,0,0,0,0] },
    h: { scale: 3600, dims: [0,0,1,0,0,0,0] },
    kg: { scale: 1, dims: [1,0,0,0,0,0,0] },
    g: { scale: .001, dims: [1,0,0,0,0,0,0] },
    A: { scale: 1, dims: [0,0,0,1,0,0,0] },
    K: { scale: 1, dims: [0,0,0,0,1,0,0] },
    degC: { scale: 1, offset: 273.15, dims: [0,0,0,0,1,0,0], affine: true },
    mol: { scale: 1, dims: [0,0,0,0,0,1,0] },
    cd: { scale: 1, dims: [0,0,0,0,0,0,1] },
    N: { scale: 1, dims: [1,1,-2,0,0,0,0] },
    J: { scale: 1, dims: [1,2,-2,0,0,0,0] },
    W: { scale: 1, dims: [1,2,-3,0,0,0,0] },
    Pa: { scale: 1, dims: [1,-1,-2,0,0,0,0] },
    Hz: { scale: 1, dims: [0,0,-1,0,0,0,0] },
    rad: { scale: 1, dims: [0,0,0,0,0,0,0] },
    deg: { scale: Math.PI/180, dims: [0,0,0,0,0,0,0] }
  };
  const FUNCTIONS = {
    sqrt: { fn: Math.sqrt, min: 0, max: Infinity },
    abs: { fn: Math.abs, min: 0, max: Infinity },
    sin: { fn: Math.sin, min: 0, max: Infinity },
    cos: { fn: Math.cos, min: 0, max: Infinity },
    tan: { fn: Math.tan, min: 0, max: Infinity },
    ln: { fn: Math.log, min: 0, max: Infinity },
    log: { fn: Math.log10, min: 0, max: Infinity },
    exp: { fn: Math.exp, min: 0, max: Infinity }
  };
  function fail(message) { throw new Error(message); }
  function tokenize(source) {
    if (typeof source !== "string" || !source.trim()) fail("Enter a formula expression.");
    if (source.length > 500) fail("Expression is too long (maximum 500 characters).");
    const tokens = [];
    let i = 0;
    while (i < source.length) {
      const rest = source.slice(i);
      const ws = /^\s+/.exec(rest);
      if (ws) { i += ws[0].length; continue; }
      const number = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(rest);
      if (number) { tokens.push({type:"number", value:Number(number[0])}); i += number[0].length; continue; }
      const ident = /^[A-Za-z_][A-Za-z0-9_]*/.exec(rest);
      if (ident) { tokens.push({type:"ident", value:ident[0]}); i += ident[0].length; continue; }
      const op = /^[+\-*/^(),]/.exec(rest);
      if (op) { tokens.push({type:op[0], value:op[0]}); i += 1; continue; }
      fail("Unsupported character at position " + (i + 1) + ".");
    }
    if (tokens.length > 200) fail("Expression has too many tokens.");
    tokens.push({type:"eof"});
    return tokens;
  }
  function parse(source) {
    const t = tokenize(source); let p = 0;
    const peek = () => t[p];
    const take = type => { if (peek().type !== type) fail("Expected '" + type + "'."); return t[p++]; };
    function primary() {
      if (peek().type === "number") return {kind:"number", value:take("number").value};
      if (peek().type === "ident") {
        const name = take("ident").value;
        if (peek().type === "(") {
          if (!FUNCTIONS[name]) fail("Function '" + name + "' is not allowed.");
          take("("); const args = [];
          if (peek().type !== ")") { args.push(expression()); while (peek().type === ",") { take(","); args.push(expression()); } }
          take(")");
          if (args.length < FUNCTIONS[name].min || args.length > 1) fail("Function '" + name + "' expects one argument.");
          return {kind:"call", name, args};
        }
        if (name === "pi") return {kind:"number", value:Math.PI};
        if (name === "e") return {kind:"number", value:Math.E};
        return {kind:"variable", name};
      }
      if (peek().type === "(") { take("("); const node = expression(); take(")"); return node; }
      fail("Expected a number, variable or parenthesised expression.");
    }
    function unary() {
      if (peek().type === "+" || peek().type === "-") { const op=t[p++].type; return {kind:"unary", op, value:unary()}; }
      return primary();
    }
    function power() { let n=unary(); if(peek().type==="^"){take("^");n={kind:"binary",op:"^",left:n,right:power()};} return n; }
    function term() { let n=power(); while(peek().type==="*"||peek().type==="/"){const op=t[p++].type;n={kind:"binary",op,left:n,right:power()};} return n; }
    function expression() { let n=term(); while(peek().type==="+"||peek().type==="-"){const op=t[p++].type;n={kind:"binary",op,left:n,right:term()};} return n; }
    const ast=expression(); if(peek().type!=="eof") fail("Unexpected token '" + peek().value + "'."); return ast;
  }
  const ZERO = [0,0,0,0,0,0,0];
  const same = (a,b) => a.every((v,i)=>v===b[i]);
  const plusDims = (a,b,k=1) => a.map((v,i)=>v+k*b[i]);
  function unitInfo(unit) { const u=UNITS[unit]; if(!u) fail("Unknown unit '" + unit + "'."); return u; }
  function toSI(value, unit) { const u=unitInfo(unit); if(u.affine) return value + u.offset; return value*u.scale; }
  function fromSI(value, unit) { const u=unitInfo(unit); if(u.affine) return value-u.offset; return value/u.scale; }
  function infer(node, vars) {
    if(node.kind==="number") return {dims:ZERO, value:node.value};
    if(node.kind==="variable") {
      if(!Object.prototype.hasOwnProperty.call(vars,node.name)) fail("Missing value for variable '" + node.name + "'.");
      const v=vars[node.name], u=unitInfo(v.unit || "1");
      return {dims:u.dims, value:toSI(v.value,u===undefined?"1":v.unit||"1")};
    }
    if(node.kind==="unary") return infer(node.value,vars);
    if(node.kind==="call") {
      const a=infer(node.args[0],vars);
      if(node.name==="sqrt") { if(a.dims.some(x=>x%2!==0)) fail("sqrt requires even powers in the input dimensions."); return {dims:a.dims.map(x=>x/2),value:Math.sqrt(a.value)}; }
      if(!same(a.dims,ZERO)) fail(node.name+" requires a dimensionless input (use radians for angles).");
      if((node.name==="ln"||node.name==="log")&&a.value<=0) fail(node.name+" requires a positive input.");
      if(node.name==="sqrt"&&a.value<0) fail("sqrt requires a non-negative input.");
      return {dims:ZERO,value:FUNCTIONS[node.name].fn(a.value)};
    }
    const a=infer(node.left,vars), b=infer(node.right,vars);
    if(node.op==="+"||node.op==="-") { if(!same(a.dims,b.dims)) fail("Cannot add or subtract quantities with different dimensions."); return {dims:a.dims,value:node.op==="+"?a.value+b.value:a.value-b.value}; }
    if(node.op==="*"||node.op==="/") {
      if(node.op==="/"&&b.value===0) fail("Division by zero.");
      if(Object.keys(vars).some(k=>(vars[k].unit||"1")==="degC")) fail("Affine temperature units cannot be multiplied or divided directly.");
      return {dims:plusDims(a.dims,b.dims,node.op==="*"?1:-1),value:node.op==="*"?a.value*b.value:a.value/b.value};
    }
    if(node.op==="^") {
      if(!same(b.dims,ZERO)||!Number.isInteger(b.value)||Math.abs(b.value)>12) fail("Exponent must be a dimensionless integer between -12 and 12.");
      if(a.value===0&&b.value<0) fail("Zero cannot be raised to a negative power.");
      return {dims:a.dims.map(x=>x*b.value),value:Math.pow(a.value,b.value)};
    }
    fail("Unsupported operation.");
  }
  function evaluate(expression, variables, outputUnit) {
    const ast=parse(expression), result=infer(ast,variables||{});
    if(!Number.isFinite(result.value)) fail("Result is not a finite number.");
    const target=outputUnit||"1", targetInfo=unitInfo(target);
    if(!same(result.dims,targetInfo.dims)) fail("Output unit does not match the result dimensions.");
    return {value:fromSI(result.value,target),siValue:result.value,unit:target,dimensions:result.dims,ast};
  }
  root.CosmoFormulaEngine = Object.freeze({
    parse, evaluate, units:Object.freeze(Object.keys(UNITS)),
    unitDimensions:unit=>unitInfo(unit).dims.slice(),
    convert:(value,from,to)=>{const a=unitInfo(from),b=unitInfo(to);if(!same(a.dims,b.dims))fail("Units are dimensionally incompatible.");return fromSI(toSI(value,from),to);}
  });
})(typeof globalThis!=="undefined"?globalThis:this);
