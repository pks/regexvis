// globals
var EPSILON     = '~';
var NEXTSTATE   = 0;
var EMPTYSYMBOL = '%';
var ALPHABET    = 'abcd'+EMPTYSYMBOL;
var ALPHABETS   = ALPHABET+'()|*';
var REDELIMITER = '$';

var ttable = new Object();
var g;
var graphit = true;
