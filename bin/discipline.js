function Tree() {
    this.parent = this;
}

Tree.prototype.addChild = function(node) {
    node.parent = this;
}

Discipline.prototype = new Tree();
Discipline.prototype.constructor = Discipline;
function Discipline(id) {
    this.id = id;
    this.parent = this;
}

Discipline.parse = function(jsonExp) {
    var jsonDis = jsonExp.disciplines;
    var disObj = {};
    var disArr = [];
    //first create all the disciplines
    for(var i = 0; i < jsonDis.length; i++) {
        var id = jsonDis[i].id;
        var dis = new Discipline(id);
        disObj[dis.id] = dis;
        disArr.push(dis);
    }
    //then add all the children
    for(var i = 0; i < jsonDis.length; i++) {
        var id = jsonDis[i].id;
        var parentId = jsonDis[i].parentId;
        disObj[parentId].addChild(disObj[id]);
    }
    return disArr;
}

Discipline.prototype.json = function() {
    return {id: this.id, parentId: this.parent.id};
}

//exports
exports.Discipline = Discipline;
exports.Discipline.parse = Discipline.parse;
exports.Discipline.prototype.json = Discipline.prototype.json;
