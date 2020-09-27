import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

function Block(props) {
  
  const [edited, setEdited] = useState(false);
  const textarea = useRef(null)

  function edit() {
    setEdited(false)
  }
  function remove() {
    props.deleteFunction(props.context, props.index)
  }
  function save(){
    let newValue = textarea.current.value;
    setEdited(true)
    props.updateFunction(props.context, newValue, props.index)
  }
  function changeBackground(event){
    let colors = ["#ffffff", "#ffaec2", "#ecccff", "#d6ebff", "#b5fff3", "#fffd95", "#fcfafb"]
    let target = event.target.closest(".planner__task")
    target.style.backgroundColor = colors[+event.target.getAttribute("dataIndex")];
    let button = event.target.closest(".planner__pallete-button");
    button.className = "planner__task-button";
    button.innerHTML = '<img class="planner__image" src="img/brush.png" alt="color pallet"/>';
  }
  function changeColor(event){
    let target = event.target.closest(".planner__task-button") || event.target.closest(".planner__pallete-button") 
    target.className = "planner__pallete-button";
    target.innerHTML = `<div class='planner__palette planner__palette--white' dataIndex="0"></div> 
                        <div class='planner__palette planner__palette--purple' dataIndex="1"></div>
                        <div class='planner__palette planner__palette--red' dataIndex="2"></div>
                        <div class='planner__palette planner__palette--blue' dataIndex="3"></div>
                        <div class='planner__palette planner__palette--green' dataIndex="4"></div>
                        <div class='planner__palette planner__palette--yellow' dataIndex="5"></div>`;
    let arrayOfColors = target.querySelectorAll(".planner__palette");
    let i = 0;
    let colors = ["#ffffff", "#ffaec2", "#ecccff", "#d6ebff", "#b5fff3", "#fffd95", "#fcfafb"]
    for(let every of arrayOfColors) {
      every.addEventListener("click", changeBackground)
      every.style.backgroundColor = colors[i]
      i++
    }
    return(
      <div>
        oifjeeeeroeri erfijroie
      </div>
    )
  }
  function renderNormalBlock (){
    return (
      <div className="planner__task">
        <textarea autoFocus ref={textarea} placeholder={props.taskName} className="planner__textarea"></textarea>
        <button onClick={save} className="planner__task-button"><img className="planner__image" src="img/ribbon.png" alt="save"/></button>
      </div>
    )
  }
  function renderEditBlock (){
    return (
      <div className="planner__task">
        <p className="planner__task-text">{props.taskName}</p>
        <button onClick={edit} className="planner__task-button"><img className="planner__image" src="img/pencil.png" alt="edit"/></button>
        <button onClick={changeColor} className="planner__task-button"><img className="planner__image" src="img/brush.png" alt="color pallet"/></button>
        <button onClick={remove} className="planner__task-button"><img className="planner__image" src="img/garbage.png" alt="delete"/></button>
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
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.target.blur()
    }
  }
  render(){
    return (
      <div className="planner__board">
        <div className="planner__title" contentEditable="" onKeyPress={this.handleKeyPress}>{this.props.titleName}</div>
        {
          this.state.tasks.map ((item,id) => {
            return (<Block key = {id} context={this} deleteFunction={this.deleteBlock} updateFunction={this.updateTextInBlock} index= {id} taskName= {item}></Block>)
          })
        }
        <button onClick={this.addBlock.bind(null, this, "Task name")} className="planner__button"><span className="planner__large-element">+</span> Add new task</button>
      </div>
    )
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Blockfield titleName="Todo list"></Blockfield>
    <Blockfield titleName="In the process"></Blockfield>
    <Blockfield titleName="Done"></Blockfield>
  </React.StrictMode>,
  document.getElementById('planner-field')
);

serviceWorker.unregister();
