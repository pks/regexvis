/*
 * RegexParser
 *
 */
function RegexParser() {}

RegexParser.prototype.getRegex = function() { return this.regex }
RegexParser.prototype.getErrorMessage = function() { return this.errorMessage }
RegexParser.prototype.getErrorPosition = function() { return this.errorPosition }

RegexParser.prototype.lookahead = function() {
    if (this.str.length > 0) {
        return this.str.substring(0, 1);
    }
    return '';
}

RegexParser.prototype.consume = function(symbol) {
    this.str = this.str.substring(1);
}

RegexParser.prototype.trymatch = function(symbol) {
    if (this.str.substring(0, symbol.length) == symbol) {
        this.consume(symbol);
        return true;
    }
    return false;
}

RegexParser.prototype.match = function(symbol) {
    if (!this.trymatch(symbol)) {
        throw("Expected symbol '"+symbol+"'.");
    }
}

RegexParser.prototype.isIn = function(symbol, set) {
	if (symbol.length > 0) {
		return set.indexOf(symbol) >= 0;
	}
	return false;
}

RegexParser.prototype.isLetter = function(symbol) {
    return this.isIn(symbol, ALPHABET);
}

RegexParser.prototype.literal = function() {
    var symbol = this.lookahead();
    if(this.isLetter(symbol)) {
        this.consume(symbol);
        return new Nfa(symbol);
    }
    throw("Expected a letter or '"+EMPTYSYMBOL+"'."); 
}

RegexParser.prototype.atom = function() {
    if(this.trymatch('(')) {
        var nfa = this.expr();
        this.match(')');
        return nfa;
    }
    return this.literal();
}

RegexParser.prototype.factor = function() {
    return this.star(this.atom());
}

RegexParser.prototype.star = function(nfa) {
    if (this.trymatch('*')) {
        return this.star(nfa.kleene());
    }
    return nfa;
}

RegexParser.prototype.term = function() {
    var nfa = this.factor();
    var symbol = this.lookahead();
    if (this.isLetter(symbol) || (symbol == '(')) {
        return nfa.concat(this.term());
    }
    return nfa;
}

RegexParser.prototype.expr = function() {
	var nfa = this.term();
    if (this.trymatch('|')) {
        return nfa.union(this.expr());
    }
    return nfa;
}

RegexParser.prototype.parse = function(regex) {
    this.str = regex;
    this.errorMessage  = 'Ok'
    this.errorPosition = -1;
    var nfa = null;

    try {
        nfa = this.expr();
        if(this.str.length > 0) {
            throw('Supernumerous symbols.');
        }
    } catch(e) {
        this.errorMessage = e;
		this.errorPosition = regex.length - this.str.length;        
        nfa = null;
    }
    return nfa;
}
