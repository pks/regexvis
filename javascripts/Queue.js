/*
 * Item
 *
 */

function Item() {
    var obj;
    var nxt;
}


/*
 * Queue
 *
 */
function Queue() {
    var topItem;
    var botItem;
}

Queue.prototype.empty = function() {
    return this.topItem == null;
}

Queue.prototype.push = function(p) {
    var b = new Item();

    if (this.empty()) {
        this.topItem = b;
    } else {
        this.botItem.next = b;
    }
    this.botItem = b;
    this.botItem.obj = p;
}


Queue.prototype.pop = function() {
    if (this.empty()) {
        throw('Queue empty');
    }
    var b = this.topItem;
    this.topItem = b.nxt;
    return b.obj;
}

