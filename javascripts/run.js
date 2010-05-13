// parse regular expression
var parser = new RegexParser();
var nfa    = parser.parse('(a|b)*');
alert(parser.getErrorMessage());

// simulate
//var simulator = new NfaSimulator(nfa);
//alert(simulator.run('aaaa'));

