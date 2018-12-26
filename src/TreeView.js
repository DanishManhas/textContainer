import React, {Component} from 'react';

class TreeView extends Component{
    constructor(props){
        super(props);
        const children = [{
                name : '/firstChild',
                isFile:false,
                children:[{
                    name :'/firstChild/firstFile',
                    isFile :true
                },
                    {
                    name : '/firstChild/2ndChild',
                    isFile:false,
                    children:[
                        {
                            name:'/firstChild/2ndChild/3rdChild',
                            isFile :false
                        },
                        {
                            name:'/firstChild/2ndChild/2ndFile',
                            isFile: true
                        }
                    ]
                }]

            
        }
        ]
        this.state ={
          tree:{
            children,
            isFile:false,
            name :''
          },
          openAddItemPopup:false,
          currentDirectory:'',
          openAddItemSelector:false,
          typedName:''
        }
        // this.renderNode = this.renderNode.bind(this);
    }

 
    addItem =(event)=>{
        console.log('currentDirectory==', this.state.currentDirectory)
        this.setState({
            openAddItemSelector:true,
            currentDirectory:event.target.value
        })
    }
    addChild(tree, nodeType){
        const {currentDirectory} = this.state;
        if(tree.name === currentDirectory){
            let childNode = {
                name : '/'
            };
            if(nodeType === 'file')
                childNode.isFile = true;
            else
                childNode.children = [];

            tree.children.push(childNode);
            this.setState({
                tree
            })
        }

    }
    onItemTypeSelection = (event)=>{
        const childType = event.target.value;
        console.log("onItemTypeSelection", childType);
        const tree = {...this.state.tree};
        console.log("Current Directory", this.state.currentDirectory);
       
        console.log("tree==", tree);
        this.addChild(tree, childType);
        this.setState({
            openAddItemSelector:false,
            openAddItemPopup:true
        })
        
    }
    getDisplayName(path){
        // const unslashed =  path.slice(0,path.length-1);
        // const sliceIndex = unslashed.lastIndexOf('/');
        const sliceIndex = path.lastIndexOf('/');

        if(sliceIndex >-1)
            return path.slice(sliceIndex+1);
        
        return path;
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
    renderNode(node){
        const children = node.children;
        const {currentDirectory} = this.state
       return<div key = {node.name}>
            <div> 
            
           {this.getDisplayName(node.name)}
           {/* {node.name} */}
           {
                !node.isFile &&
                 <button value = {node.name} onClick ={this.addItem}>Add item </button>}
           {this.state.openAddItemSelector &&  (currentDirectory === node.name) && <div>
               {/* <select onChange  = {this.onItemTypeSelection}>
                   <option value = "folder">Create Folder</option>
                   <option  value = "file">Create File</option>


                </select> */}
                <div>
                    <button value = 'folder' onClick = {this.onItemTypeSelection}>Create folder</button>
                    <br/>
                    <button value = 'file' onClick = {this.onItemTypeSelection}>Create File </button>
                 </div>
               </div>}
               {this.state.openAddItemPopup && currentDirectory === node.name &&
                    <div>
                        {/* <input type = 'text' value = {this.getDisplayName(currentDirectory)} onChange = {this.onNaming}/> */}
                        </div>}
            
            </div>
            {
                children  && children.map(element => this.renderNode(element))}
            </div>
    }
    render(){
        return (
            <div>
             {this.renderNode(this.state.tree)}
                </div>
        )
    }


}
export default TreeView;