// 
function checkLength(el, bId) {
	if(el.value.length > 0) {
		enable(bId);
	} else {
		disable(bId);
	};
};

// 
function enable(id) {
		 $(id).removeAttr("disabled");
};

// 
function disable(id) {
	 $(id).attr("disabled","disabled");
};

// 
function uiParse() {
	var parser = new RegexParser();
	nfa = parser.parse($('#regex').attr('value'));
	$('#parseMessage').html('Parse: '+parser.getErrorMessage());
	if (parser.getErrorMessage() != 'Ok') {
		$('#parseMessage').removeClass('success');	
		$('#parseMessage').addClass('failure');	
		$('#regex').addClass('failure');
	} else {
		$('#parseMessage').removeClass('failure');
		$('#regex').removeClass('failure');
		$('#parseMessage').addClass('success');
		$('#regex').addClass('success');
		enable('#word');
		var dfa = new Nfa2Dfa(nfa);
		var ttable = dfa.do();
		graph();
		disable('#regex');
		disable('#parseButton');
	};
	$('#parseMessage').effect("highlight", {}, 1000);
};

// 
function uiSimulate() {
	var simulator = new NfaSimulator(nfa);
	var check = simulator.simulate($('#word').attr('value'));
	if (!check) {
		$('#checkMessage').html('Word not accepted');
		$('#checkMessage').removeClass('success');
		$('#word').removeClass('success');	
		$('#checkMessage').addClass('failure');
		$('#word').addClass('failure');	
	} else {
		$('#checkMessage').html('Word accepted');
		$('#checkMessage').removeClass('failure');	
		$('#word').removeClass('failure');	
		$('#checkMessage').addClass('success');
		$('#word').addClass('success');
	};
	$('#checkMessage').effect("highlight", {}, 1000);	
};
