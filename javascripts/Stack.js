/*
 * Stack
 *
 */
function Stack() {
	this.a = new Array();
	this.length = 0;
}

Stack.prototype.push = function(obj) {
	this.a.push(obj);
	this.length++;
}

Stack.prototype.pop = function() {
	if (this.isEmpty()) {
		throw('Pop from empty stack.');
	}
	this.length--;
	return this.a.pop();
}

Stack.prototype.isEmpty = function() {
	if (this.length == 0) {
		return true;
	}
	return false;
}

Stack.prototype.get = function(index) {
	return this.a[index];
}

Stack.prototype.copy = function() {
	var c = ((new Array()).concat(this.a));
	var ret = new Stack();
	ret.a = c;
	ret.length = this.length;
	return ret;
}

Stack.prototype.str = function() {
	ret = '';
	for (var i=0; i < this.length; i++) {
		ret += this.a[i].id + ' ';
	}
	return ret;
}
