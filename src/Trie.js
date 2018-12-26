function Trie(name = ''){
    this.value = name;
    this.children = new Map();
    this.isFile = false;
}
Trie.prototype.add = function(path,node = this){
    for(const name of path){
        if(node.children[name]){
            node = node.children[name]
        }
        else{
            const newNode = new Trie(name);
            node.children[name] = newNode;
            node = newNode;
        }
    }
    node.isFile = true;
}