import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

function Block(props) {
  
  const [edited, setEdited] = useState(false);
  const textarea = useRef(null)

  function edit() {
    setEdited(true)
  }
  function remove() {
    props.deleteFunction(props.context, props.index)
  }
  function save(){
    let newValue = textarea.current.value;
    props.updateFunction(props.context, newValue, props.index)
    setEdited(false)
  }
  function renderNormalBlock (){
    return (
      <div className="wrapper">
        <p>{props.taskName}</p>
        <button onClick={edit} className="btn">Edit</button>
        <button onClick={remove} className="btn">Remove</button>
      </div>
    )
  }
  function renderEditBlock (){
    return (
      <div className="wrapper">
        <textarea ref={textarea} defaultValue={props.taskName}></textarea>
        <button onClick={save} className="btn">Save</button>
      </div>
    )
  }
  if (edited){
    return renderEditBlock();
  } else {
    return renderNormalBlock();
  }
}
class Blockfield extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: []
    }
  }
  addBlock (context, text) {
    var arreyOfTasks = context.state.tasks;
    arreyOfTasks.push(text);
    context.setState ({tasks: arreyOfTasks})
  }
  deleteBlock(context, index) {
    let arreyOfTasks = context.state.tasks;
    arreyOfTasks.splice(index, 1);
    context.setState ({arreyOfTasks})
  }
  updateTextInBlock(context, text, index) {
    let arreyOfTasks = context.state.tasks;
    arreyOfTasks[index] = text;
    context.setState ({arreyOfTasks})
  }
  render(){
    return (
      <div >
        <button onClick={this.addBlock.bind(null, this, "osdijco")} className="btn">Add</button>
        {
          this.state.tasks.map ((item,id) => {
            return (<Block key = {id} context={this} deleteFunction={this.deleteBlock} updateFunction={this.updateTextInBlock} index= {id} taskName= {item}></Block>)
          })
        }
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Blockfield></Blockfield>
  </React.StrictMode>,
  document.getElementById('planner-field')
);

serviceWorker.unregister();
