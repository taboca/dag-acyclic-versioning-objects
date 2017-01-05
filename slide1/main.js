


const crypto = require('crypto');

var commitsDb = new Array();
var objectsDb = new Array();

/* Commit Items will go through parent commit tree
   and will prepare new Commit tree */
	 
function commitItems(listObjects, commitsDb, parentCommitId) {

		function commitItem()  {
				this.refPathsArray = new Array();
				this.id = getSha('random_'+Math.random());
		}

		var nc = new commitItem();

		console.log('Creating commit = ' + nc.id);

		// builds parent commit tree items
    var parentTree = new Array();
		if(parentCommitId) {
			var parentCommit = commitsDb[parentCommitId];
			for(var k in parentCommit.refPathsArray) {
				var item = parentCommit.refPathsArray[k];
				console.log('    Checking parent['+parentCommitId+'] tree item: '+item.treeRef);
				parentTree[k] = item;
			}
		}

		for (k in listObjects) {
					var curr = listObjects[k];
					//console.log(curr.treeItem);

					console.log('   ' + curr.treeItem)
					nc.refPathsArray[curr.treeItem] = {
							commitId: nc.id,
							parent: parentCommitId,
							objRef: curr,
							treeRef: curr.treeItem
					}

					if(parentCommitId) {
							//console.log(parentCommitId);
							var parentCommit = commitsDb[parentCommitId];
							if(curr.treeItem in parentTree) {
								console.log('   Found ' + curr.treeItem + ' in ' + parentCommitId);
								delete parentTree[curr.treeItem];
							}
					}
		}

		for(var k in parentTree) {
					console.log('   Parent left over: ', k)
					var item = parentTree[k];
					nc.refPathsArray[k] = {
							commitId: item.commitId,
							parent: item.parent,
							objRef: item.objRef,
							treeRef: item.treeRef
					}
		}

		console.log(nc.refPathsArray)
		commitsDb[nc.id] = nc;
		return nc;
}

//function prepareObject(indexDb, refTree, obj, type) {
function prepareObject(indexDb, obj, type) {
		var objId = '';
		if(type=='string') {
			objId = getSha(obj);
		}

		if(indexDb[objId]) {

		} else {
			indexDb[objId]={
				object:obj,
				type:'string',
				sha1: objId
			}
		}
		return objId;
}

function getSha(mString) {
		return crypto.createHash('sha1').update(mString).digest('hex');
}

function genId() {
		return Math.random();
}

function main() {
		console.log('Creating object: string');

		var obj1 = prepareObject(objectsDb, 'marcio', 'string');
		console.log(obj1);
		var obj2 = prepareObject(objectsDb, 'marcio2', 'string');
		console.log(obj2);
		var obj3 = prepareObject(objectsDb, 'marcio3', 'string');
		console.log(obj3);

		var commitData = [
			{ treeItem: '/src/slide1', object:obj1 },
			{ treeItem: '/src/slide2', object:obj2 },
			]

		var commitData2 = [
			{ treeItem: '/src/slide2', object:obj3 },
			]

		var commitData3 = [
			{ treeItem: '/src/slide2', object:obj1 },
			]

		var c1 = commitItems( commitData, commitsDb, null);
		var c2 = commitItems( commitData2, commitsDb, c1.id);
		var c3 = commitItems( commitData3, commitsDb, c2.id);
}

main();
