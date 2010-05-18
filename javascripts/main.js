// globals
var EPSILON     = '~';
var NEXTSTATE   = 0;
var EMPTYSYMBOL = '%';
var ALPHABET    = 'abc'+EMPTYSYMBOL;
var REDELIMITER = '$';
var regex       = 'a*b|b*a' //(a|b)*'//'a(a|b)*a');
var word	    = 'ba'; //'abba';


function main() {
	// parse regular expression
	var parser = new RegexParser();
	var nfa    = parser.parse(regex);
	document.write('Parsing: '+parser.getErrorMessage()+'<br />');
	
	// simulate
	var simulator = new NfaSimulator(nfa);
	document.write('\''+word+'\' in <em>L</em>: '+simulator.simulate(word)+'<br />');
	
	// nfa -> dfa
	document.write('<pre>');
	var dfa = new Nfa2Dfa(nfa);
	var ttable = dfa.do();
	document.write('</pre>');
	
	//drawGraph()
}
