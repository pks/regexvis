/*
 * RegexParser
 *
 */
function RegexParser() {
    this.alphabet         = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUWXYZ';
    this.str = this.regex = '';
    this.errorMessage     = 'Ok'
    this.errorPosition    = -1;
}


RegexParser.prototype.lookahead = function() {
    if (this.str.length > 0) {
        return this.str.substring(0,1);
    }
    return '';
}

RegexParser.prototype.consume = function(symbol) {
    this.str = this.str.substring(1);
}

RegexParser.prototype.trymatch = function(symbol) {
    if (this.str.substring(0, 1) == symbol) {
        this.consume(symbol);
        return true;
    }
    return false;
}

RegexParser.prototype.match = function(symbol) {
    if (!this.trymatch(symbol)) {
        throw('Expected symbol '+symbol);
    }
}

RegexParser.prototype.isLetter = function(symbol) {
    return this.alphabet.indexOf(symbol) >= 0;
}

RegexParser.prototype.literal = function() {
    var symbol = this.lookahead();
    if(this.isLetter(symbol)) {
        this.consume(symbol);
        return new Nfa(symbol);
    }
    throw('Expected symbol or %.'); 
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
    return this.stars(this.atom());
}

RegexParser.prototype.stars = function(nfa) {
    if (this.trymatch('*')) {
        return this.stars(nfa.star());
    }
    return nfa;
}

RegexParser.prototype.term = function() {
    var nfa = this.factor();
    var symbol = this.lookahead();
    if (this.isLetter(symbol) || (symbol == '(')) {
        return nfa.concatenation(this.term());
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

RegexParser.prototype.parse = function(str) {
    var nfa;
    this.str = this.regex = str;

    //try {
        nfa = this.expr();
        if(this.str.length>0) {
            throw('Supernumerous symbols');
        }
    //} catch(e) {
    //    this.errorMessage = e;
    //    this.errorPosition = str.length - this.str.length;        
    //    nfa = null;
    //}
    return nfa;
}

RegexParser.prototype.getRegex = function() { return this.regex }
RegexParser.prototype.getErrorMessage = function() { return this.errorMessage }
RegexParser.prototype.getErrorPosition = function() { return this.errorPosition }

