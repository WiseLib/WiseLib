function Tree() {
    this.parent = this;
}

Tree.prototype.addChild = function(node) {
    node.parent = this;
}


var Discipline = function(id) {
    this.id = id;
    this.parent = this;
};
Discipline.prototype = new Tree();
Discipline.prototype.constructor = Discipline;

//exports
module.exports = Discipline;
