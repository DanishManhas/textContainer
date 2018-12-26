import React, {Component} from 'react';

class NewTreeView extends Component{
    constructor(props){
        super(props);
        const secondChild = {
            isFile:true,
            parent : firstChild
        }
        const fileInsideFirstChild = {
            isFile:true,
            parent : firstChild
        }
        const firstChild = {
            parent: rootNode,
            isFile : false,
            children:[{
                secondChild}, {fileInsideFirstChild}
            ]
        }
        const rootNode= {
            children: [{firstChild}, {firstFile}],
            isFile:false
          }
        const firstFile = {
            parent : rootNode,
            isFile:true
        }
        this.state ={
            tree:{rootNode
          },
          openAddItemPopup:false,
          currentDirectory:'',
          openAddItemSelector:false,
          typedName:''
        }
        // this.renderNode = this.renderNode.bind(this);
    }

 
    addItem =(event)=>{
        console.log("Add item event", event.target);
        this.setState({
            openAddItemSelector:true,
            // currentDirectory:event.target.value
        })
    }
    onItemTypeSelection = (event)=>{
        const childType = event.target.value;
        this.setState({
            openAddItemSelector:false,
            openAddItemPopup:true
        })
        if(childType === 'file'){
            
        }
    }
    getDisplayName(path){
        let sliceIndex = path.lastIndexOf('/');
        if(sliceIndex >-1)
        return path.slice(sliceIndex+1);
        return '';
    }
    onNaming =(event)=>{
        console.log("event==", event.target);
        event.persist();
        let {currentDirectory} = this.state;
        if(currentDirectory === 'root')
            this.setState(state=>{
                console.log("The state was===", state);
                let value = `${currentDirectory}/${event.target.value}`;
                state.tree = {...state.tree,name :value };
                state.currentDirectory = value;
            })
        // let newTree = this.state.tree.map((node)=>{

        // })
        // this.setState({
        //     typedName:event.target.value
        // })
    }

    renderNode(node, index){
        console.log("the node is ==", node);

        for(const prop in node){
            if(node.hasOwnProperty(prop))
            return (
                <div key = {index}>
                <div>{prop}
                {!node[prop].isFile && <button value = {node}onClick = {this.addItem}>Add items </button>}
                 </div>
                 <div> 
                     {this.state.openAddItemSelector && 
                        <select onChange  = {this.onItemTypeSelection}>
                        <option  value = "file">Create File</option>
                        <option value = "folder">Create Folder</option>
     
                        </select>
                    }
                </div>
                { node[prop].children && node[prop].children.map((child,idx)=>this.renderNode(child, idx))}
                </div>
            )
        }
        

    }

    
    render(){
        console.log("the state is ===", this.state)

        return (
            <div>
                {this.renderNode(this.state.tree, -1)}
                </div>
        )
    }


}
export default NewTreeView;