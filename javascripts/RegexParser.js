/*
 * RegexParser
 * Parsing a regular expression using recursive descent method.
 * parse() returns a NFA (constructed following Thompson's algrotihm).
 */


function RegexParser() {};

// Accessor functions
RegexParser.prototype.getRegex = function() { return this.regex; };
RegexParser.prototype.getErrorMessage = function() { return this.errorMessage; };
RegexParser.prototype.getErrorPosition = function() { return this.errorPosition; };

// Next symbol in regex.
RegexParser.prototype.lookahead = function() {
    if (this.str.length > 0) {
        return this.str.substring(0, 1);
    };
    return '';
};

// Removing the firstmost symbol of regex.
RegexParser.prototype.consume = function(symbol) {
    this.str = this.str.substring(1);
};

// Check if symbol matches expected symbol.
RegexParser.prototype.trymatch = function(symbol) {
    if (this.str.substring(0, symbol.length) == symbol) {
        this.consume(symbol);
        return true;
    };
    return false;
};

// See above.
RegexParser.prototype.match = function(symbol) {
    if (!this.trymatch(symbol)) {
        throw("RegexParser.match(): Expected symbol '"+symbol+"'.");
    };
};

// Checks if a symbol is in set of symbols.
RegexParser.prototype.isIn = function(symbol, set) {
	if (symbol.length > 0) {
		return set.indexOf(symbol) >= 0;
	};
	return false;
};

// See above. Set = alphabet.
RegexParser.prototype.isLetter = function(symbol) {
    return this.isIn(symbol, ALPHABET);
};

// Is symbol a literal?
RegexParser.prototype.literal = function() {
    var symbol = this.lookahead();
    if(this.isLetter(symbol)) {
        this.consume(symbol);
        return new Nfa(symbol);
    };
    throw("RegexParser.literal(): Expected a letter or '"+EMPTYSYMBOL+"'.");
};

// Atomar expression.
RegexParser.prototype.atom = function() {
    if(this.trymatch('(')) {
        var nfa = this.expr();
        this.match(')');
        return nfa;
    };
    return this.literal();
};

// Factor.
RegexParser.prototype.factor = function() {
    return this.star(this.atom());
};

// Kleene Star.
RegexParser.prototype.star = function(nfa) {
    if (this.trymatch('*')) {
        return this.star(nfa.kleene());
    };
    return nfa;
};

// Term.
RegexParser.prototype.term = function() {
    var nfa = this.factor();
    var symbol = this.lookahead();
    if (this.isLetter(symbol) || (symbol == '(')) {
        return nfa.concat(this.term());
    };
    return nfa;
};

// Expression.
RegexParser.prototype.expr = function() {
	var nfa = this.term();
    if (this.trymatch('|')) {
        return nfa.union(this.expr());
    };
    return nfa;
};

// Parse function.
var nfa;
RegexParser.prototype.parse = function(regex) {
    this.str = regex;
    this.errorMessage  = 'Ok'
    this.errorPosition = -1;
    var nfa;

    try {
        nfa = this.expr();
        if(this.str.length > 0) {
            throw('RegexParser.parse(): Supernumerous symbols.');
        };
    } catch(e) {
        this.errorMessage = e;
		this.errorPosition = regex.length - this.str.length;
        nfa = null;
    };
    return nfa;
};

