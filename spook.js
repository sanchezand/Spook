/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var spook = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[2,2],$V1=[1,12],$V2=[1,13],$V3=[1,14],$V4=[1,15],$V5=[1,16],$V6=[1,17],$V7=[1,18],$V8=[1,19],$V9=[1,20],$Va=[1,21],$Vb=[1,22],$Vc=[1,23],$Vd=[1,24],$Ve=[5,8,16,34,36,37,39,40,41,42,43,44,45,46,51,52,54],$Vf=[1,26],$Vg=[2,21],$Vh=[1,29],$Vi=[1,39],$Vj=[1,42],$Vk=[1,34],$Vl=[1,40],$Vm=[1,37],$Vn=[1,38],$Vo=[5,8,14,16,26,29,34,35,36,37,39,40,41,42,43,44,45,46,51,52,54,55],$Vp=[5,8,14,16,26,29,34,35,36,37,39,40,41,42,43,44,45,46,51,52,54,55,62,63,64,65],$Vq=[5,8,14,16,26,29,34,35,36,37,39,40,41,42,43,44,45,46,51,52,54,55,58,59,62,63,64,65],$Vr=[5,8,14,16,26,29,34,35,36,37,39,40,41,42,43,44,45,46,51,52,54,55,58,59,60,61,62,63,64,65],$Vs=[13,16,25,32,58,59],$Vt=[1,84],$Vu=[1,85],$Vv=[2,17],$Vw=[1,90],$Vx=[8,16,34,36,39,40,41,42,43,44,45,46,51,52,54],$Vy=[8,16,34,36,39,40,41,42,43,44,45,46,51,54],$Vz=[5,8,12,16,26,29,34,36,37,39,40,41,42,43,44,45,46,51,52,54],$VA=[2,22],$VB=[2,42],$VC=[1,124];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"start":3,"statements":4,"EOF":5,"statement":6,"vars":7,"DEF":8,"idlist":9,":":10,"type":11,"[":12,"NUMBER":13,"]":14,"assign":15,"NAME":16,"ASSIGN":17,"expression":18,"exp":19,"compOp":20,"termino":21,"addSub":22,"factor":23,"multDiv":24,"(":25,")":26,"val":27,"expressionlist2":28,",":29,"expressionlist":30,"id":31,"BOOLEAN":32,"conditional":33,"IF":34,"THEN":35,"END":36,"ELSE":37,"actions":38,"FORWARD":39,"ROTRIGHT":40,"PICKUP":41,"PUTDOWN":42,"DETECT_BOX":43,"DETECT_WALL":44,"INVENTORY":45,"OUT":46,"funparams":47,"funparams1":48,"funparams2":49,"function":50,"FUNCTION":51,"return":52,"loop":53,"REPEAT":54,"DO":55,"DECIMAL":56,"BOOL":57,"+":58,"-":59,"*":60,"/":61,"EQUALS":62,"GTRTHN":63,"LESTHN":64,"NOT":65,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"DEF",10:":",12:"[",13:"NUMBER",14:"]",16:"NAME",17:"ASSIGN",25:"(",26:")",29:",",32:"BOOLEAN",34:"IF",35:"THEN",36:"END",37:"ELSE",39:"FORWARD",40:"ROTRIGHT",41:"PICKUP",42:"PUTDOWN",43:"DETECT_BOX",44:"DETECT_WALL",45:"INVENTORY",46:"OUT",51:"FUNCTION",52:"return",54:"REPEAT",55:"DO",56:"DECIMAL",57:"BOOL",58:"+",59:"-",60:"*",61:"/",62:"EQUALS",63:"GTRTHN",64:"LESTHN",65:"NOT"},
productions_: [0,[3,2],[4,0],[4,2],[7,4],[7,7],[15,3],[15,6],[18,1],[18,3],[19,1],[19,3],[21,1],[21,3],[23,3],[23,2],[23,1],[28,0],[28,3],[30,0],[30,2],[31,1],[31,4],[31,4],[27,1],[27,1],[27,1],[9,1],[9,3],[33,5],[33,7],[38,3],[38,3],[38,3],[38,3],[38,3],[38,3],[38,3],[38,4],[47,2],[47,3],[48,4],[49,0],[49,5],[50,7],[50,5],[53,5],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[11,1],[11,1],[22,1],[22,1],[24,1],[24,1],[20,1],[20,1],[20,1],[20,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:

		console.log("Global:", GLOBAL_TABLE);
		console.log("Scope:", SCOPE_TABLE);
		return GLOBAL_TABLE
	
break;
case 4:

		for(var i of $$[$0-2]){
			var added = addVar(i, $$[$0]);
			if(!added) {
				// THROW ERROR
			}
		}
	
break;
case 5:

		for(var i of $$[$0-5]){
			var added = addVar(i, $$[$0-3], parseInt($$[$0-1]))
			if(!added){
				// THROW ERROR
			}
		}
	
break;
case 6:

		setVar($$[$0-2], $$[$0]);
	
break;
case 7:

		setVar($$[$0-5], $$[$0], $$[$0-3]);
	
break;
case 8:

		this.$ = $$[$0];
	
break;
case 9:

		this.$ = $$[$0-1]=='*' ? $$[$0-2]*$$[$0] : $$[$0-2]/$$[$0];
		if($$[$0-1]=='>'){
			this.$ = $$[$0-2] > $$[$0];
		}else if($$[$0-1]=='<'){
			this.$ = $$[$0-2] < $$[$0];
		}else if($$[$0-1]=='=='){
			this.$ = $$[$0-2] == $$[$0];
		}else if($$[$0]=='!='){
			this.$ = $$[$0-2] != $$[$0];
		}
	
break;
case 10: case 12: case 16:

		this.$ = $$[$0]
	
break;
case 11:

		this.$ = $$[$0-1]=='+' ? $$[$0-2]+$$[$0] : $$[$0-2]-$$[$0];
	
break;
case 13:

		this.$ = $$[$0-1]=='*' ? $$[$0-2]*$$[$0] : $$[$0-2]/$$[$0];
	
break;
case 14:

		this.$ = $$[$0-1];
	
break;
case 15:

		this.$ = parseFloat($$[$0]) * ($$[$0-1]=='-' ? -1 : 1);
	
break;
case 17:

		this.$ = []
	
break;
case 18:

		this.$ = [ $$[$0-1], ...$$[$0] ]
	
break;
case 19:
 // Empty expression list
		this.$ = []
	
break;
case 20:

		this.$ = [$$[$0-1], ...$$[$0]]
	
break;
case 21:

		this.$ = getVar($$[$0]).val;
	
break;
case 22:

		//Get val array in var table 
		var val = getVar($$[$0-3]);
		var pos = parseInt($$[$0-1]);
		if(!val || !val.size || pos>val.size-1){
			// THROW ERROR
		}
		this.$ = val.val[pos];
	
break;
case 23:

		// Calc val from function call
		console.log("FuncCall:", $$[$0-3], $$[$0-1])
	
break;
case 24:

		this.$ = parseFloat($$[$0])
	
break;
case 25:

		this.$ = $$[$0] === 'true'
	
break;
case 27:

		this.$ = [$$[$0]]
	
break;
case 28:

		this.$ = [$$[$0-2], ...$$[$0]]
	
break;
case 29: case 35:

		
	
break;
case 30: case 36:


	
break;
case 31:

		// yy.moves.push(0);
	
break;
case 32:

		// yy.moves.push(1);
	
break;
case 33:

		// yy.moves.push(2);
	
break;
case 34:

		// yy.moves.push(3);
	
break;
case 37:

		this.$ = yy.inventory
	
break;
case 38:

		console.log($$[$0-1])
	
break;
}
},
table: [o([5,8,16,34,39,40,41,42,43,44,45,46,51,54],$V0,{3:1,4:2}),{1:[3]},{5:[1,3],6:4,7:5,8:$V1,15:6,16:$V2,31:11,33:7,34:$V3,38:8,39:$V4,40:$V5,41:$V6,42:$V7,43:$V8,44:$V9,45:$Va,46:$Vb,50:9,51:$Vc,53:10,54:$Vd},{1:[2,1]},o($Ve,[2,3]),o($Ve,[2,47]),o($Ve,[2,48]),o($Ve,[2,49]),o($Ve,[2,50]),o($Ve,[2,51]),o($Ve,[2,52]),o($Ve,[2,53]),{9:25,16:$Vf},o($Ve,$Vg,{12:[1,28],17:[1,27],25:$Vh}),{13:$Vi,16:$Vj,18:30,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},{25:[1,43]},{25:[1,44]},{25:[1,45]},{25:[1,46]},{25:[1,47]},{25:[1,48]},{25:[1,49]},{25:[1,50]},{16:[1,51]},{13:$Vi,16:$Vj,18:52,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},{10:[1,53]},{10:[2,27],29:[1,54]},{13:$Vi,16:$Vj,18:55,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},{13:$Vi,16:$Vj,18:56,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},{13:$Vi,16:$Vj,18:58,19:31,21:32,22:35,23:33,25:$Vk,26:[2,19],27:36,30:57,31:41,32:$Vl,58:$Vm,59:$Vn},{35:[1,59]},o($Vo,[2,8],{20:60,62:[1,61],63:[1,62],64:[1,63],65:[1,64]}),o($Vp,[2,10],{22:65,58:$Vm,59:$Vn}),o($Vq,[2,12],{24:66,60:[1,67],61:[1,68]}),{13:$Vi,16:$Vj,18:69,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},{13:$Vi,16:$Vj,27:70,31:41,32:$Vl},o($Vr,[2,16]),o($Vs,[2,56]),o($Vs,[2,57]),o($Vr,[2,24]),o($Vr,[2,25]),o($Vr,[2,26]),o($Vr,$Vg,{12:[1,71],25:$Vh}),{26:[1,72]},{26:[1,73]},{26:[1,74]},{26:[1,75]},{26:[1,76]},{26:[1,77]},{26:[1,78]},{13:$Vi,16:$Vj,18:79,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},{25:[1,81],47:80},{55:[1,82]},{11:83,56:$Vt,57:$Vu},{9:86,16:$Vf},o($Ve,[2,6]),{14:[1,87]},{26:[1,88]},{26:$Vv,28:89,29:$Vw},o([8,16,34,36,37,39,40,41,42,43,44,45,46,51,54],$V0,{4:91}),{13:$Vi,16:$Vj,19:92,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},o($Vs,[2,60]),o($Vs,[2,61]),o($Vs,[2,62]),o($Vs,[2,63]),{13:$Vi,16:$Vj,19:93,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},{13:$Vi,16:$Vj,21:94,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},o($Vs,[2,58]),o($Vs,[2,59]),{26:[1,95]},o($Vr,[2,15]),{13:$Vi,16:$Vj,18:96,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},o($Ve,[2,31]),o($Ve,[2,32]),o($Ve,[2,33]),o($Ve,[2,34]),o($Ve,[2,35]),o($Ve,[2,36]),o($Ve,[2,37]),{26:[1,97]},o($Vx,$V0,{4:98}),{16:[1,101],26:[1,99],48:100},o($Vy,$V0,{4:102}),o($Ve,[2,4],{12:[1,103]}),o($Vz,[2,54]),o($Vz,[2,55]),{10:[2,28]},o($Ve,$VA,{17:[1,104]}),o($Vr,[2,23]),{26:[2,20]},{13:$Vi,16:$Vj,18:105,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},{6:4,7:5,8:$V1,15:6,16:$V2,31:11,33:7,34:$V3,36:[1,106],37:[1,107],38:8,39:$V4,40:$V5,41:$V6,42:$V7,43:$V8,44:$V9,45:$Va,46:$Vb,50:9,51:$Vc,53:10,54:$Vd},o($Vo,[2,9]),o($Vp,[2,11]),o($Vq,[2,13]),o($Vr,[2,14]),{14:[1,108]},o($Ve,[2,38]),{6:4,7:5,8:$V1,15:6,16:$V2,31:11,33:7,34:$V3,36:[1,110],38:8,39:$V4,40:$V5,41:$V6,42:$V7,43:$V8,44:$V9,45:$Va,46:$Vb,50:9,51:$Vc,52:[1,109],53:10,54:$Vd},o($Vx,[2,39]),{26:[1,111]},{10:[1,112]},{6:4,7:5,8:$V1,15:6,16:$V2,31:11,33:7,34:$V3,36:[1,113],38:8,39:$V4,40:$V5,41:$V6,42:$V7,43:$V8,44:$V9,45:$Va,46:$Vb,50:9,51:$Vc,53:10,54:$Vd},{13:[1,114]},{13:$Vi,16:$Vj,18:115,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},{26:$Vv,28:116,29:$Vw},o($Ve,[2,29]),o($Vy,$V0,{4:117}),o($Vr,$VA),{13:$Vi,16:$Vj,18:118,19:31,21:32,22:35,23:33,25:$Vk,27:36,31:41,32:$Vl,58:$Vm,59:$Vn},o($Ve,[2,45]),o($Vx,[2,40]),{11:119,56:$Vt,57:$Vu},o($Ve,[2,46]),{14:[1,120]},o($Ve,[2,7]),{26:[2,18]},{6:4,7:5,8:$V1,15:6,16:$V2,31:11,33:7,34:$V3,36:[1,121],38:8,39:$V4,40:$V5,41:$V6,42:$V7,43:$V8,44:$V9,45:$Va,46:$Vb,50:9,51:$Vc,53:10,54:$Vd},{36:[1,122]},{26:$VB,29:$VC,49:123},o($Ve,[2,5]),o($Ve,[2,30]),o($Ve,[2,44]),{26:[2,41]},{16:[1,125]},{10:[1,126]},{11:127,56:$Vt,57:$Vu},{26:$VB,29:$VC,49:128},{26:[2,43]}],
defaultActions: {3:[2,1],86:[2,28],89:[2,20],116:[2,18],123:[2,41],128:[2,43]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

	var GLOBAL_TABLE = [];
	var SCOPE_TABLE = [];
	
	var scope = -1;

	function addVar(name, type, array_size=false){
		var val = {
			name,
			type,
			val: type=='bool' ? false : -1
		}
		if(array_size){
			val.size = array_size;
			val.val = Array(array_size).fill(type=='bool' ? false : -1)
		}
		if(scope<=-1){
			if(GLOBAL_TABLE.find(a=>a.name==name)) return false;
			GLOBAL_TABLE.push(val);
		}
		else{
			if(SCOPE_TABLE[scope].find(a=>a.name==name)) return false;
			SCOPE_TABLE[scope].push(val);
		}
		return true;
	}

	function getValFromType(val, type){
		if(type=='bool'){
			return val > 0;
		}else{
			return parseFloat(val);
		}
	}

	function setVar(name, val, pos=false){
		if(scope<=-1){
			var ix = GLOBAL_TABLE.findIndex(a=>a.name==name);
			if(ix==-1) return false;
			if(GLOBAL_TABLE[ix].size && pos===false) return false;
			if(pos!==false){
				if(pos>GLOBAL_TABLE[ix].size-1) return false;
				GLOBAL_TABLE[ix].val[pos] = getValFromType(val, GLOBAL_TABLE[ix].type);
			}else{
				GLOBAL_TABLE[ix].val = getValFromType(val, GLOBAL_TABLE[ix].type);
			}
		}else{
			var ix = SCOPE_TABLE[scope].findIndex(a=>a.name==name);
			if(ix==-1) return false;
			if(SCOPE_TABLE[scope][ix].size && !pos) return false;
			if(pos!==false){
				if(pos>SCOPE_TABLE[scope][ix].size-1) return false;
				SCOPE_TABLE[scope][ix].val[pos] = getValFromType(val, SCOPE_TABLE[scope][ix].type);
			}else{
				SCOPE_TABLE[scope][ix].val = getValFromType(val, SCOPE_TABLE[scope][ix].type);
			}
		}
	}

	function getVar(name){
		if(scope<=-1){
			return GLOBAL_TABLE.find(a=>a.name==name);
		}else{
			var scope_var = SCOPE_TABLE[scope].find(a=>a.name==name);
			if(!scope_var){
				return GLOBAL_TABLE.find(a=>a.name==name);
			} else return scope_var;
		}
	}

	function addScope(){
		SCOPE_TABLE.push([])
		scope = SCOPE_TABLE.length-1;
	}

	function exitScope(){
		SCOPE_TABLE.pop();
		scope = SCOPE_TABLE.length-1;
	}
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 32
break;
case 2:return 8
break;
case 3:return 60
break;
case 4:return 61
break;
case 5:return 59
break;
case 6:return 58
break;
case 7:return 25
break;
case 8:return 26
break;
case 9:return 29
break;
case 10:return 10
break;
case 11:return 12
break;
case 12:return 17
break;
case 13:return 14
break;
case 14:return 56
break;
case 15:return 57
break;
case 16:return 34
break;
case 17: addScope(); return 35 
break;
case 18: exitScope(); return 36 
break;
case 19:return 37
break;
case 20:return 62
break;
case 21:return 63
break;
case 22:return 64
break;
case 23:return 65
break;
case 24:return 51
break;
case 25:return 'RETURN'
break;
case 26:return 54
break;
case 27:return 55
break;
case 28:return 46
break;
case 29:return 39
break;
case 30:return 40
break;
case 31:return 41
break;
case 32:return 42
break;
case 33:return 43
break;
case 34:return 44
break;
case 35:return 45
break;
case 36:return 13
break;
case 37:return 16
break;
case 38:return 5
break;
}
},
rules: [/^(?:\s+)/,/^(?:(true|false))/,/^(?:def\b)/,/^(?:\*)/,/^(?:\/)/,/^(?:-)/,/^(?:\+)/,/^(?:\()/,/^(?:\))/,/^(?:,)/,/^(?::)/,/^(?:\[)/,/^(?:=)/,/^(?:\])/,/^(?:decimal\b)/,/^(?:bool\b)/,/^(?:if\b)/,/^(?:then\b)/,/^(?:end\b)/,/^(?:else\b)/,/^(?:==)/,/^(?:>)/,/^(?:<)/,/^(?:NOT\b)/,/^(?:fun\b)/,/^(?:return\b)/,/^(?:repeat\b)/,/^(?:do\b)/,/^(?:OUT\b)/,/^(?:forward\b)/,/^(?:rotateRight\b)/,/^(?:pickUp\b)/,/^(?:putDown\b)/,/^(?:detectBox\b)/,/^(?:detectWall\b)/,/^(?:inventory\b)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:[a-zA-Z][a-zA-Z_]*)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = spook;
exports.Parser = spook.Parser;
exports.parse = function () { return spook.parse.apply(spook, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}