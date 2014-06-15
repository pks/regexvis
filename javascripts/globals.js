// globals
var EPSILON     = '~';                  // internal use, symbol for 'non-symbol'
var NEXTSTATE   = 0;                    // internal use, state indices, begin at 0
var STOPSYMBOL  = '%';                  // internal use, stop symbol
var ALPHABET    = 'abcd'+STOPSYMBOL;    // used alphabet, need to include stop symbol
var SPECIALS    = '()|*';               // symbol with special meaning in a regex
var ALPHABETS   = ALPHABET+SPECIALS;    // include special symbols
var REDELIMITER = '$';                  // internal use, delimiter for regex

var ttable           = new Object(); // transition table, internal use
var g;                               // graph object (used by Raphael)
var graphit          = true;         // draw a graph? value set by checkbox
var lock             = false;        // lock for graph animation
var alphabetEdit     = false;        // are we currently editing the alphabet?
var alphabetEditable = true;         // is the alphabet still editable?

