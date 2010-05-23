// globals
var EPSILON     = '~';
var NEXTSTATE   = 0;
var EMPTYSYMBOL = '%';
var ALPHABET    = 'abc'+EMPTYSYMBOL;
var ALPHABETS   = ALPHABET+'()|*';
var REDELIMITER = '$';

var ttable = new Object();
var g;
