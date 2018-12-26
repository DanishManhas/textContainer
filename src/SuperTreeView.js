import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {List, ListItem, ListItemText, Collapse, ListItemIcon, IconButton} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles'
import {ExpandLess, ExpandMore, Folder, InsertDriveFile, Add} from '@material-ui/icons';

const styles = theme => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing.unit * 4,
    },
  });

class SuperTreeView extends Component {
    constructor(props) {
        super(props);
        const children = [{
            id: '0',
            name: '0',
            isFile: false,
            children: [{
                id: '0.0',
                name: '0.0',
                isFile: true
            },
            {
                id: '0.1',
                name: '0.1',
                isFile: false,
                children: [
                    {
                        id: '0.1.0',
                        name: '0.1.0',
                        children: [],
                        // isFile :false
                    },
                    {
                        id: '0.1.1',
                        name: '0.1.1',
                        isFile: true
                    }
                ]
            }]


        }, {
            id: '1',
            name: '2ndChildInRoot',
            children: []
        }
        ]
        this.state = {
            tree: {
                children,
                isFile: false,
                name: 'root',
                id: ''
            },
            openAddItemPopup: false,
            parentNode: '',
            openAddItemSelector: false,
            typedName: '',
            openFolders : []
        }
        // this.renderNode = this.renderNode.bind(this);
    }


    addItem = (event) => {
        console.log('currentDirectory==', this.state.currentDirectory)
        this.setState({
            openAddItemSelector: true,
            parentNode: event.target.value
        })
    }
    createInsertionIndex(parentString, tree) {
        let indexPoint = tree
        let currentLevelIndex = 0;
        let parsedString = '';
        if (parentString.length > 0) {
            for (let i = 0; i < parentString.length; i++) {
                if (parentString[i] === '.') {
                    console.log("a dot found");
                    parsedString = parentString.substring(0, i)
                    currentLevelIndex = indexPoint.children.findIndex((child) => child.id === parsedString);
                    indexPoint = indexPoint.children[currentLevelIndex]
                    console.log('insertion Point is ===', indexPoint);
                    currentLevelIndex = 0;
                }
                else {
                    console.log("this index was found", parentString[i]);
                    currentLevelIndex = currentLevelIndex * 10 + parseInt(parentString[i]);
                    console.log('currentLevelIndex', currentLevelIndex);
                }

            }
            indexPoint = indexPoint.children[currentLevelIndex]
            console.log('insertion Point is ===', indexPoint);
        }
        return indexPoint;

    }
    addChild(tree, childType) {
        console.log("node initially", tree);
        let { parentNode } = this.state;
        let childNode = {
            name: ''
        }
        childType === 'file' ? childNode.isFile = true : childNode.children = [];


        let insertionIndex = this.createInsertionIndex(parentNode, tree);
        if (!parentNode.length) childNode.id = '' + insertionIndex.children.length;
        else childNode.id = `${insertionIndex.id}.${insertionIndex.children.length}`
        console.log("childNode", childNode);
        insertionIndex.children.push(childNode);
        console.log("tree", tree);
        this.setState({
            tree
        })
        // }


    }
    onItemTypeSelection = (event) => {
        const childType = event.target.value;
        console.log("onItemTypeSelection", childType);
        const tree = { ...this.state.tree };
        // console.log("Current Directory", this.state.currentDirectory);

        console.log("tree==", tree);
        this.addChild(tree, childType);
        this.setState({
            openAddItemSelector: false,
            openAddItemPopup: true
        })

    }
    getDisplayName(path) {
        // const unslashed =  path.slice(0,path.length-1);
        // const sliceIndex = unslashed.lastIndexOf('/');
        const sliceIndex = path.lastIndexOf('/');

        if (sliceIndex > -1)
            return path.slice(sliceIndex + 1);

        return path;
    }
    onNaming = (event) => {
        console.log("event==", event.target);
        event.persist();
        let { currentDirectory } = this.state;
        if (currentDirectory === 'root')
            this.setState(state => {
                console.log("The state was===", state);
                let value = `${currentDirectory}/${event.target.value}`;
                state.tree = { ...state.tree, name: value };
                state.currentDirectory = value;
            })
        // let newTree = this.state.tree.map((node)=>{

        // })
        // this.setState({
        //     typedName:event.target.value
        // })
    }

    removeNode = (event) => {
        let deletionId = event.target.value;
        const tree = { ...this.state.tree };
        let deletionParent = tree;
        let deletionIndex = 0;
        let traversedString = '';
        const findDeletionIndex = ((parent) => parent.children.findIndex(child => {
            return child.id === traversedString;
        }))
        for (let i = 0; i < deletionId.length; i++) {
            if (deletionId[i] === '.') {
                traversedString = deletionId.substring(0, i);
                deletionIndex = findDeletionIndex(deletionParent);
                deletionParent = deletionParent.children[deletionIndex];
                deletionIndex = 0;
            }
            else {
                traversedString = deletionId.substring(0, i + 1);
                deletionIndex = 10 * deletionIndex + parseInt(deletionId[i]);
            }
        }
        deletionParent.children.splice(findDeletionIndex(deletionParent), 1);
        
        this.setState({ tree });
        return;

    }
    nestedListStatus(id){
       let nodeIndex =  this.state.openFolders.indexOf(id);
       if(nodeIndex !== -1) return true
       else return false;
    }
    showSubTree(id){
         this.setState(state=>({openFolders:[...state.openFolders, id]}));
    }
    closeSubTree  (id){
        let openFolders= [...this.state.openFolders];
        let idFieldIndex = openFolders.indexOf(id);
        openFolders.splice(idFieldIndex, 1);
        this.setState({
            openFolders
        });

    }
    renderNode = (node)=>{
        console.log("node rendered===", node);
        const isNested = this.nestedListStatus(node.id);
        return (
            <Fragment  key = {node.id}>
            <ListItem >
                <ListItemIcon>
                    {node.isFile?
                    <IconButton>
                    <InsertDriveFile/>
                    </IconButton>
                    :
                     isNested?
                     <IconButton onClick = {()=>this.closeSubTree(node.id)}>
                     <ExpandLess/>
                     </IconButton> 
                        :<IconButton onClick = {()=>this.showSubTree(node.id)}> <ExpandMore/></IconButton>}
                    </ListItemIcon>
                    <ListItemText> {node.name}</ListItemText>
                </ListItem>
                <Collapse in= {isNested} timeout="auto" unmountOnExit>
                <List component="div" disablePadding className = {this.props.classes.nested}>
                    {node.children && node.children.map(child=>this.renderNode(child))}
                </List>
              </Collapse>
              </Fragment>
        ) 
    }


    render() {
        let {tree} = {...this.state};
        const {classes} = this.props;
        return (
            <List className = {classes.root}>
                <ListItem button>
                    <ListItemIcon>
                        <Folder/>
                        </ListItemIcon>
                        <ListItemText>
                            root
                            </ListItemText>
                            <IconButton color = 'secondary'>
                            <Add/>
                            </IconButton>
                    </ListItem>
                    {tree.children && tree.children.map(child=>this.renderNode(child))}
                </List>
        )
    }


}
SuperTreeView.propTypes = {
    classes : PropTypes.object.isRequired
}

export default withStyles(styles)(SuperTreeView);