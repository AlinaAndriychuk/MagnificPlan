import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import gsap from 'gsap';

function PopupBlock(props) {
  const taskName = useRef(null);
  const description = useRef(null);
  const hours = useRef(null);
  const minutes = useRef(null);
  const files = useRef(null);
  const [floated, setFloated] = useState(true);

  function showPopup(event){
    setFloated(false)
  }

  function hidePopup(){
    props.saveFunction(props.taskContext, taskName.current.innerText, props.taskIndex, description.current.value, hours.current.value, minutes.current.value, files.current.innerHTML)
    setFloated(true)
  }

  function changeFiles (event) {
    let listOfFiles = event.target.files,
      len = listOfFiles.length,
      previousText = files.current.innerHTML;
    for (let i = 0; i < len; i++) {
      previousText += listOfFiles[i].name +"\n"
    }
    files.current.innerHTML = previousText;

  }

  
  function renderPopup (){
    return (
      <div className='popup-wrapper'>
        <div className="popup">
          <img onClick={()=> setFloated(true)} className="popup__cancel" src="img/cancel.png" alt="cancel"/>
          <div contentEditable="" onKeyPress={props.onKey} ref={taskName} style={props.styleOfBlock} className="popup__task">{props.taskName}</div>
          <p className="popup__prompt"><img className="popup__prompt-image" src="img/ellipsis.png" alt="description"/>Description</p>
          <textarea className="popup__description" placeholder="Write description to your task" ref={description} defaultValue={props.descValue}></textarea>
          <p className="popup__prompt"><img className="popup__prompt-image" src="img/time.png" alt="time"/>Time estimation</p>
          <textarea className="popup__time" ref={hours} maxLength="3" defaultValue={props.hoursValue}></textarea> 
          <p className="popup__marker">h</p>
          <textarea className="popup__time" ref={minutes} maxLength="2" defaultValue={props.minutesValue}></textarea>
          <p className="popup__marker">m</p>
          <p className="popup__prompt"><img className="popup__prompt-image" src="img/attachment.png" alt="attachment"/>Attachments</p>
          <input className="popup__file" onChange={changeFiles} type="file" multiple/>
          <pre className="popup__file-text" ref={files} onKeyPress={props.onKey} contentEditable="">{props.filesValue}</pre>
          <button onClick={() =>{
            props.deleteFunction();
            setFloated(true)
          }} className="popup__button-change"><img className="planner__image" src="img/garbage.png" alt="delete"/></button>
          <Colorpalette blockfieldIndex={props.blockfieldIndex} colorFunction={props.colorFunction} blockfieldContext={props.blockfieldContext}></Colorpalette>
          <button onClick={hidePopup} className=" popup__button">
            Save
          </button>
        </div>
      </div>
    )
  }
  function renderButton (){
    return (
      <button onClick={showPopup} className="planner__task-button">
        <img className="planner__image" src="img/options.png" alt="more option"/>
      </button>
    )
  }

  if (floated){
    document.documentElement.style.overflow = "";
    document.body.style.paddingRight = "0px";
    return renderButton();
  } else {
    document.documentElement.style.overflow = "hidden";
    if(document.documentElement.clientWidth >= 861){
      document.body.style.paddingRight = "16px";
    }
    return renderPopup();
  }

}


function Colorpalette(props) {
  const color = useRef(null)
  const colorIndexes = [0, 1, 2, 3, 4, 5];
  const [colored, setColored] = useState(true);
  function showPalette(){
    setColored(false)
  }
  let styleForColor = {}
  let arrayOfColors = ["#ffffff","#d6ebff","#ecccff","#ff919e","#91ffbb","#fbffc7"];
  for (let i = 0; i < 6; i++){
    styleForColor[i] = {
      backgroundColor: arrayOfColors[i],
    }
  }

  function changeBackground(index) {
    props.colorFunction(props.blockfieldContext, arrayOfColors[index], props.blockfieldIndex)
    setColored(true);
  }
  
  function renderPaletteBlock (){
    return (
      <button className="planner__palette-button">
        {
          colorIndexes.map ((item) => {
            return (<div onClick={()=> changeBackground(item)} ref={color} style={styleForColor[item]} className='planner__palette' key = {item} index={item}></div>)
          })
        }
      </button>
    )
  }
  function renderBrushBlock (){
    return (
      <button onClick={showPalette} className="popup__button-change">
        <img className="planner__image" src="img/brush.png" alt="color pallet"/>
      </button>
    )
  }

  if (colored){
    return renderBrushBlock();
  } else {
    return renderPaletteBlock();
  }
}

function Block(props) {
  
  const [edited, setEdited] = useState(false);
  const textarea = useRef(null);

  function edit() {
    setEdited(false)
  }
  function remove() {
    props.deleteFunction(props.context, props.index)
  }
  function save(){
    let newValue = textarea.current.value;
    setEdited(true) 
    if(!newValue) newValue = textarea.current.placeholder
    props.updateFunction(props.context, newValue, props.index)
  }
  function textareaKeyPress(event) {
    if (event.key === 'Enter') {
      save()
    }
  }
  function renderEditBlock (){
    return (
      <div className="planner__task">
        <textarea autoFocus onKeyPress={textareaKeyPress} ref={textarea} placeholder={props.taskName} className="planner__textarea"></textarea>
        <button onClick={save} className="planner__task-button"><img className="planner__image" src="img/ribbon.png" alt="save"/></button>
      </div>
    )
  }
   let styleOfBlock = {
    backgroundColor: props.backColor,
  }
  function showBasket(event){
    if(document.documentElement.clientWidth >= 861){
      let basket = document.getElementsByClassName("planner__delete-button")[0];
      gsap.to(basket, {left: 100, display: "inline-block"})
    }
  }
  function hideBasket(event){
    let basket = document.getElementsByClassName("planner__delete-button")[0];
    gsap.to(basket, {left: -100, rotateZ: 0, display: "none"});
    
    if(deleteTask){
      let parentOfTask = document.getElementById(props.realParent).querySelector(".planner__button")
      parentOfTask.before(event.target.closest(".planner__task"));
      remove()
      deleteTask = false;
    }
  }
  function renderNormalBlock (){
    return (
      <div style={styleOfBlock} className="planner__task">
        <p onMouseUp={hideBasket} onMouseDown={showBasket} className="planner__task-text">{props.taskName}</p>
        <button onClick={edit} className="planner__task-button--edit"><img className="planner__image" src="img/pencil.png" alt="edit"/></button>
        <PopupBlock taskIndex={props.index} filesValue={props.files} hoursValue={props.hours} minutesValue={props.minutes} onKey={props.onKeyPressFunction} descValue={props.descriptionValue} taskContext = {props.context} saveFunction={props.updateFunction} styleOfBlock={styleOfBlock} deleteFunction={remove} blockfieldIndex={props.index} colorFunction={props.colorFunction} blockfieldContext={props.context} styleTask={styleOfBlock} taskName={props.taskName}></PopupBlock>
      </div>
    )
  }

  if (edited){
    return renderNormalBlock();
  } else {
    return renderEditBlock();
  }
}

function BlockTitle(props) {
  
  const [edited, setEdited] = useState(false);
  const textarea = useRef(null)

  function edit() {
    setEdited(true)
  }
  function save(){
    let newValue = textarea.current.value;
    if(!textarea.current.value) newValue = props.titleName
    setEdited(false)
    props.changeTitle(props.context, newValue, props.index)
  }
  function textareaKeyPress(event) {
    if (event.key === 'Enter') {
      save()
    }
  }
  function renderEditBlock (){
    return (
      <div className="planner__textarea-container planner__task">
        <textarea autoFocus maxLength="17" onKeyPress={textareaKeyPress} ref={textarea} placeholder={props.titleName} className="planner__textarea"></textarea>
        <button onClick={save} className="planner__task-button"><img className="planner__image" src="img/ribbon.png" alt="save"/></button>
      </div>
    )
  }
  function renderNormalBlock (){
    return (
      <div className="planner__title-container">
          <div className="planner__title" title={props.titleName} onKeyPress={textareaKeyPress}>{props.titleName}</div>
          <button onClick={edit} className="planner__task-button--edit"><img className="planner__image" src="img/pencil.png" alt="edit"/></button>
      </div>
    )
  }

  if (!edited){
    return renderNormalBlock();
  } else {
    return renderEditBlock();
  }
}

class Blockfield extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: [],
      colors: [],
      description: [],
      hours: [], 
      minutes: [],
      files: [],
    }
  }
  addBlock (context, text, color, desc, hours, minutes, files) {
    let arrayOfTasks = context.state.tasks;
    let arrayOfColors = context.state.colors;
    let arrayOfDescriptions = context.state.description;
    let arrayOfHours = context.state.hours;
    let arrayOfMinutes = context.state.minutes;
    let arrayOfFiles = context.state.files;
    arrayOfTasks.push(text);
    arrayOfColors.push(color);
    arrayOfDescriptions.push(desc);
    arrayOfHours.push(hours);
    arrayOfMinutes.push(minutes);
    arrayOfFiles.push(files);
    context.setState ({tasks: arrayOfTasks, colors: arrayOfColors, description: arrayOfDescriptions, hours: arrayOfHours, minutes: arrayOfMinutes, files: arrayOfFiles})
  }
  changeColorOfBlock(context, color, index){
    let arrayOfTasks = context.state.tasks;
    let arrayOfColors = context.state.colors;
    arrayOfColors[index] = color;
    context.setState ({tasks: arrayOfTasks, colors: arrayOfColors})
  }
  deleteBlock(context, index) {
    let arrayOfTasks = context.state.tasks;
    let arrayOfColors = context.state.colors;
    let arrayOfDescriptions = context.state.description;
    let arrayOfHours = context.state.hours;
    let arrayOfMinutes = context.state.minutes;
    let arrayOfFiles = context.state.files;
    arrayOfTasks.splice(index, 1);
    arrayOfColors.splice(index, 1);
    arrayOfDescriptions.splice(index, 1);
    arrayOfHours.splice(index, 1);
    arrayOfMinutes.splice(index, 1);
    arrayOfFiles.splice(index, 1);
    context.setState ({task: arrayOfTasks, colors: arrayOfColors, description: arrayOfDescriptions, hours: arrayOfHours, minutes: arrayOfMinutes, files: arrayOfFiles})
  }
  updateTextInBlock(context, text, index, desc, hours, minutes, files) {
    let arrayOfTasks = context.state.tasks;
    let arrayOfColors = context.state.colors;
    let arrayOfDescriptions = context.state.description;
    let arrayOfHours = context.state.hours;
    let arrayOfMinutes = context.state.minutes;
    let arrayOfFiles = context.state.files;
    arrayOfTasks[index] = text;
    if(desc === "" || desc) arrayOfDescriptions[index] = desc; 
    if(hours === "" || hours) arrayOfHours[index] = hours; 
    if(minutes === "" || minutes) arrayOfMinutes[index] = minutes; 
    if(files === "" || files) arrayOfFiles[index] = files; 
    context.setState ({task: arrayOfTasks, colors: arrayOfColors, description: arrayOfDescriptions, hours: arrayOfHours, minutes: arrayOfMinutes, files: arrayOfFiles})
  }
  saveTitleOfList(context, title, index){
    context.props.changeTitle(title, index);
  }
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.target.blur()
    }
  }
  render(){
    return (
      <div id={this.props.idName} className="planner__board">
        <BlockTitle context={this} index={this.props.index} changeTitle={this.saveTitleOfList} titleName= {this.props.titleName}></BlockTitle>
        {
          this.state.tasks.map ((item,id) => {
            return (<Block realParent={this.props.idName} backColor={this.state.colors[id]} onKeyPressFunction={this.handleKeyPress} files={this.state.files[id]} descriptionValue={this.state.description[id]} hours={this.state.hours[id]} minutes={this.state.minutes[id]} key = {id} context={this} colorFunction={this.changeColorOfBlock} deleteFunction={this.deleteBlock} updateFunction={this.updateTextInBlock} index= {id} taskName= {item}></Block>)
          })
        }
        <button onClick={this.addBlock.bind(null, this, "Task name", "#fcfafbda", "", "0", "0", "")} className="planner__button"><span className="planner__large-element">+</span> Add new task</button>
      </div>
    )
  }
}



// function DeskPopup(props){ 
  
//   function KeyPressEnter(event) {
//     if (event.key === 'Enter') {
//       event.target.blur()
//     }
//   }

//   function createBoard(){
//     if(textareaNameOfBoard.current.value){
//       props.returnButton()
//     }else {
//       alert("Fill the board name field");
//       textareaNameOfBoard.current.style.borderColor ="#ff4036";
//     }
    
//   }

//   function showBoards(){
//     return (
//     <div className= "planner-full-board">
//         <Blockfield idName="forthBoard" titleName="Column name"></Blockfield>
//         <Blockfield idName="fifthBoard"  titleName="Column name"></Blockfield>
//         <Blockfield idName="sixBoard" titleName="Column name"></Blockfield>
//     </div>
//     )
//   }
//   function showPopup(){
//     return (
//       <div className="popup-wrapper desk-popup">
//         <div className="popup">
//           <img className="popup__cancel" src="img/cancel.png" alt="cancel"/>
//           <textarea autoFocus maxLength="17" ref={textareaNameOfBoard} placeholder="Board name" onKeyPress={KeyPressEnter} className="popup__textarea-board"></textarea>
//           <p className="popup__prompt"><img className="popup__prompt-image" src="img/ellipsis.png" alt="description"/>Number of columns</p>
//           <div className="popup-radio">
//             <input className="popup__input" type="radio" id="oneColumn" name="column"/>
//             <label className="popup__label" htmlFor="oneColumn">1</label>
//           </div>
//           <div className="popup-radio">
//             <input className="popup__input" type="radio" id="twoColumn" name="column"/>
//             <label className="popup__label" htmlFor="twoColumn">2</label>
//           </div>
//           <div className="popup-radio">
//             <input className="popup__input" type="radio" id="threeColumn" name="column" defaultChecked />
//             <label className="popup__label" htmlFor="threeColumn">3</label>
//           </div>  
//           <p className="popup__prompt"><img className="popup__prompt-image" src="img/time.png" alt="time"/>Color of board</p>
//           <button onClick={createBoard} className="popup__button">
//             Create
//           </button>
//         </div>
//       </div>
//     )
//   }
//   if(showBoardsField){
//     return showBoards()
//   }else {
//     return showPopup()
//   }
// }  

// function CreateDeskButton(props){
  
//   function addFullBoard(event){
//     props.setRender()
//     if(document.documentElement.clientWidth >= 845){
//       document.body.style.paddingRight = "16px";
//     }
//     document.documentElement.style.overflow = "hidden";
//   }

//   function showButton(){
//     return <button className="planner-bar__add-button" onClick={addFullBoard}>+</button>
//   }
//   function showDesks(){
//     return <DeskPopup returnButton={props.setRender} createNewBoard={props.createNewBoard}/>
//   }

//   if(props.renderFunction){
//     return showDesks()
//   }else {
//     return showButton()
//   }
// }

function ChooseBar() {
  const [boardDetails, setBoardDetails] = useState({boardFullNames: ["New board"], showPopup: [], titlesOfMiniBoards: ["Todo list", "In progress", "Done"]});
  const textareaNameOfBoard = useRef(null);
  let numberOfNewMiniBoards = 0;

  function KeyPressEnter(event) {
    if (event.key === 'Enter') {
       event.target.blur()
    }
  }

  
  function showPopup(){
    if(document.documentElement.clientWidth >= 845){
      document.body.style.paddingRight = "16px";
    }
    document.documentElement.style.overflow = "hidden"; 
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [true], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards})
  }
  function changeTitleOfList(title, index){
    let titlesOfBoards = boardDetails.titlesOfMiniBoards;
    titlesOfBoards[index] = title;
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: titlesOfBoards});
  }

  function hidePopup(event) {
    let namesOfBoards = boardDetails.boardFullNames;
    let titlesOfBoards = boardDetails.titlesOfMiniBoards;

    if(!event){
      namesOfBoards.push(textareaNameOfBoard.current.value);
      for (let every of Array.from(document.getElementsByClassName("planner__board"))) {
        every.style.display = "none";
      }
      for(let i = 0; i < numberOfNewMiniBoards; i++) {
        titlesOfBoards.push("List name");
      }
      if(document.documentElement.clientWidth >= 861){
        gsap.from(document.getElementsByClassName("planner-full-board")[0], {duration: 0.8, opacity: 0, marginTop: 340})
      }else {
        gsap.from(document.getElementsByClassName("planner-full-board")[0], {duration: 1, opacity: 0})
      }  
    }
    document.body.style.paddingRight = "0px";
    document.documentElement.style.overflow = ""; 
    setBoardDetails({boardFullNames: namesOfBoards, showPopup: [], titlesOfMiniBoards: titlesOfBoards})
  }

  function desideToHidePopup(){
    if(textareaNameOfBoard.current.value){
      if(document.getElementById("threeColumn").checked) {
        numberOfNewMiniBoards = 3
      }else if(document.getElementById("twoColumn").checked) {
        numberOfNewMiniBoards = 2
      }else {
        numberOfNewMiniBoards = 1;
      }
      hidePopup()
    }else {
      alert("Fill the board name field");
      textareaNameOfBoard.current.style.borderColor ="#ff4036";
    }
  }
  
  return (
    <React.Fragment>
      <div className= "planner-bar">
        {
          boardDetails.boardFullNames.map ((item,id) => {
            return (
              <div key={id} className="planner-bar__desk">
                <div className="planner-bar__name">
                  <p title={item} className="planner-bar__text">{item}</p>
                </div>
                <button className="planner-bar__delete"><img className="planner-bar__image" src="img/cancel.png" alt="delete"/></button>
              </div>
            )
          })
        }
        {
          boardDetails.showPopup.map ((item, id) => {
            return (
              <div key= {id} className="popup-wrapper desk-popup">
                <div className="popup">
                  <img className="popup__cancel" onClick={hidePopup} src="img/cancel.png" alt="cancel"/>
                  <textarea autoFocus maxLength="17" ref={textareaNameOfBoard} placeholder="Board name" onKeyPress={KeyPressEnter} className="popup__textarea-board"></textarea>
                  <p className="popup__prompt"><img className="popup__prompt-image" src="img/ellipsis.png" alt="description"/>Number of columns</p>
                  <div className="popup-radio">
                    <input className="popup__input" type="radio" id="oneColumn" name="column"/>
                    <label className="popup__label" htmlFor="oneColumn">1</label>
                  </div>
                  <div className="popup-radio">
                    <input className="popup__input" type="radio" id="twoColumn" name="column"/>
                    <label className="popup__label" htmlFor="twoColumn">2</label>
                  </div>
                  <div className="popup-radio">
                    <input className="popup__input" type="radio" id="threeColumn" name="column" defaultChecked />
                    <label className="popup__label" htmlFor="threeColumn">3</label>
                  </div>  
                  <p className="popup__prompt"><img className="popup__prompt-image" src="img/time.png" alt="time"/>Color of board</p>
                  <button onClick={desideToHidePopup} className="popup__button">
                    Create
                  </button>
                </div>
              </div>
            )
          })
        }
        <button className="planner-bar__add-button" onClick={showPopup}>+</button>
      </div>
      <div className= "planner-full-board">
        {
          boardDetails.titlesOfMiniBoards.map ((item, id) => {
            return (
              <Blockfield key = {id} index={id} idName={"board" + ++id} changeTitle={changeTitleOfList} titleName={item}></Blockfield>
            )
          })
        }
      </div>
    </React.Fragment>
  ) 

  
}


ReactDOM.render(
  <React.Fragment>
    <ChooseBar></ChooseBar>
    <button className="planner__delete-button"><img className="planner__delete-image" alt="waste basket" src="../img/basket.png"/></button>
  </React.Fragment>,
  document.getElementById('planner-field')
);


let plannerContainer = document.getElementsByClassName("planner")[0];
let isDragging = false;
let deleteTask = false;
plannerContainer.addEventListener('mousedown', function(event) {

  let dragElement = event.target.closest('.planner__task');
  let clickElement = event.target.closest('.planner__task-text');
  if (!clickElement) return;

  event.preventDefault();

  dragElement.ondragstart = function() {
      return false;
  };

  let  shiftX, shiftY;

  startDrag(dragElement, event.clientX, event.clientY);

  function onMouseUp(event) {
    finishDrag(event);
  };
  let currentDroppable = null;
  let currentBucket = null;

  function enterDroppable(elem) {
    gsap.to(elem, { boxShadow: " 7px 7px 5px #f0ddfc"})
  }

  function leaveDroppable(elem) {
    gsap.to(elem, { backgroundColor: "#f9f0fa", boxShadow: "none"})
  }

  function enterBucket(elem) {
    gsap.to(elem, {duration: 0.5, rotateZ: -30})
  }

  function leaveBucket(elem) {
    gsap.to(elem, { duration: 0.5, rotateZ: 0})
  }

  function onMouseMove(event) {
    moveAt(event.clientX, event.clientY);

    dragElement.style.display = "none";
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    dragElement.style.display = "inline-block"
    
    if (!elemBelow) return;
    let droppableBelow = elemBelow.closest('.planner__board');

    if (currentDroppable !== droppableBelow) {

      if (currentDroppable) {
        leaveDroppable(currentDroppable);
      }
      currentDroppable = droppableBelow;
      if (currentDroppable) {
        enterDroppable(currentDroppable);
      }
    }

    let droppableBucket = document.getElementsByClassName("planner__delete-button")[0];
    let droppableBucketImage = document.getElementsByClassName("planner__delete-image")[0];

    if (elemBelow === droppableBucket || elemBelow === droppableBucketImage) {
      currentBucket = droppableBucket;
      if (currentBucket) {
        enterBucket(currentBucket);
      }
      
    } else {
      if (currentBucket) {
        leaveBucket(currentBucket);
        currentBucket = null;
      }
    }
  }

  function startDrag(element, clientX, clientY) {
    if(isDragging) {
      return;
    }

    isDragging = true;

    plannerContainer.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseup', onMouseUp);

    shiftX = clientX - element.getBoundingClientRect().left;
    shiftY = clientY - element.getBoundingClientRect().top;



    element.style.position = 'fixed';
    element.style.zIndex = 10;
    moveAt(clientX, clientY);
  };

  function finishDrag(event) {
    if(!isDragging) {
      return;
    }

    dragElement.style.display = "none"
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    dragElement.style.display = "inline-block"
    if (!elemBelow) return;

    let droppableBucket = document.getElementsByClassName("planner__delete-button")[0];
    let droppableBucketImage = document.getElementsByClassName("planner__delete-image")[0];

    if (elemBelow === droppableBucket || elemBelow === droppableBucketImage){
      deleteTask = true;
    }
    let droppableBelow = elemBelow.closest('.planner__board');

    isDragging = false;
    if (droppableBelow){
      let nearestTask = elemBelow.closest('.planner__task');
      
      if(nearestTask){
        nearestTask.after(dragElement)
      } else {
        let bottom = droppableBelow.getElementsByClassName("planner__button")[0];
        if(bottom) {
          bottom.before(dragElement);
        }
      }
      gsap.to(droppableBelow, { backgroundColor: "#f9f0fa", boxShadow: "none"})
    }

    gsap.to(dragElement, {duration: 0, top: 0, left: 0, zIndex: "auto", position: "relative"})

    plannerContainer.removeEventListener('mousemove', onMouseMove);
    dragElement.removeEventListener('mouseup', onMouseUp);
  }

  function moveAt(clientX, clientY) {
    let newX = clientX - shiftX;
    let newY = clientY - shiftY;

    if (newX > document.documentElement.clientWidth - dragElement.offsetWidth) {
      newX = document.documentElement.clientWidth - dragElement.offsetWidth;
    }

    gsap.to(dragElement, {duration: 0, left: newX, top: newY})
  }

});

serviceWorker.unregister();
gsap.from(".header__logo", {duration: 2, y: 270});
gsap.from(".header__title", {duration: 2, rotationY: 90, opacity:0});

if(document.documentElement.clientWidth >= 845) {
  gsap.from(".header__item:first-child", {duration: 2, y: -100});
  gsap.from(".header__item:last-child", {duration: 2, delay: 1, y: -100});

  gsap.from("#board1", {duration: 0.8, marginTop: 340, opacity: 0});
  gsap.from(" #board1 .planner__title, #board1 .planner__button", {duration: 0.8, delay: 0.8, opacity: 0});
  gsap.from("#board2", {duration: 0.8, delay: 0.7, marginTop: 340, opacity: 0});
  gsap.from(" #board2 .planner__title, #board2 .planner__button", {duration: 0.8, delay: 1.5, opacity: 0});
  gsap.from("#board3", {duration: 0.8, delay: 1.5, marginTop: 340, opacity: 0});
  gsap.from(" #board3 .planner__title, #board3 .planner__button", {duration: 0.8, delay: 2.2, opacity: 0});
} else {
  gsap.from(".header__item:first-child", {duration: 2, y: 200});
  gsap.from(".header__item:last-child", {duration: 2, y: -200});

  gsap.from("#board1", {duration: 0.8, opacity: 0});
  gsap.from(" #board1 .planner__title, #board1 .planner__button", {duration: 0.8, delay: 0.8, opacity: 0});
  gsap.from("#board2", {duration: 0.8, delay: 0.7, opacity: 0});
  gsap.from(" #board2 .planner__title, #board2 .planner__button", {duration: 0.8, delay: 1.5, opacity: 0});
  gsap.from("#board3", {duration: 0.8, delay: 1.5, opacity: 0});
  gsap.from(" #board3 .planner__title, #board3 .planner__button", {duration: 0.8, delay: 2.2, opacity: 0});
}

const anchors = document.querySelectorAll('a[href*="#"]')

for (let anchor of anchors) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    
    const blockID = anchor.getAttribute('href').substr(1)
    
    document.getElementById(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}

window.addEventListener("scroll", function(event) {
  if(document.documentElement.clientWidth >= 845) {
    if (document.documentElement.scrollTop > 200 && document.documentElement.scrollTop < 750) {
      gsap.to(" .advantages__heading", {duration: 2, opacity: 1, rotationX: 0});
      gsap.to(" .advantages__line", {duration: 1, rotationY: 0});
    }  
    if (document.documentElement.scrollTop > 400 && document.documentElement.scrollTop < 950) {
      gsap.to(" #advantages__image--first", {duration: 2, rotationY: 0, opacity: 1});
      gsap.to(".advantages-block--first .advantages__title", {duration: 2, opacity: 1, rotationY: 0});
      gsap.to(".advantages-block--first .advantages__text", {duration: 2, opacity: 1, rotationY: 0});
    } 
    if (document.documentElement.scrollTop > 700 && document.documentElement.scrollTop < 1300) {
      gsap.to(" #advantages__image--second", {duration: 2, rotationY: 0, opacity: 1});
      gsap.to(".advantages-block--middle .advantages__title", {duration: 2, opacity: 1, rotationY: 0});
      gsap.to(".advantages-block--middle .advantages__text", {duration: 2, opacity: 1, rotationY: 0});
    } 
    if (document.documentElement.scrollTop > 1100 && document.documentElement.scrollTop < 1700) {
      gsap.to(" #advantages__image--third", {duration: 2, rotationY: 0, opacity: 1});
      gsap.to(".advantages-block--last .advantages__title", {duration: 2, opacity: 1, rotationY: 0});
      gsap.to(".advantages-block--last .advantages__text", {duration: 2, opacity: 1, rotationY: 0});
    } 
    if (document.documentElement.scrollTop > 1450 && document.documentElement.scrollTop < 2200) {
      gsap.to(".quote-block__title", {duration: 2, opacity: 1, rotateX: 0});
    } 
    if (document.documentElement.scrollTop > 1900) {
      gsap.to(".features-block:first-child .features-block__image", {duration: 2, opacity: 1, rotateY: -0, rotateX: 180});
      gsap.to(".features-block:first-child .features-block__title", {duration: 2, opacity: 1, rotateY: 0});
      gsap.to(".features-block--middle .features-block__image", {duration: 2, opacity: 1, delay: 0.5, rotateY: -180, rotateX: -180});
      gsap.to(".features-block--middle .features-block__title", {duration: 2, opacity: 1, delay: 0.5, rotateY: 0});
      gsap.to(".features-block:last-child .features-block__image", {duration: 2, opacity: 1, delay: 1, rotateY: 360, rotateX: -180});
      gsap.to(".features-block:last-child .features-block__title", {duration: 2, opacity: 1, delay: 1, rotateY: 0});
    }
  }
  if(document.documentElement.clientWidth < 845 && document.documentElement.clientWidth >= 384 ) {
    if (document.documentElement.scrollTop > 400 && document.documentElement.scrollTop < 900) {
      gsap.to(" .advantages__heading", {duration: 2, opacity: 1, rotationX: 0});
      gsap.to(" .advantages__line", {duration: 1, rotationY: 0});
    }  
    if (document.documentElement.scrollTop > 700 && document.documentElement.scrollTop < 1250) {
      gsap.to(" #advantages__image--first", {duration: 2, rotationY: 0, opacity: 1});
      gsap.to(".advantages-block--first .advantages__title", {duration: 2, opacity: 1, rotationY: 0});
      gsap.to(".advantages-block--first .advantages__text", {duration: 2, opacity: 1, rotationY: 0});
    } 
    if (document.documentElement.scrollTop > 1100 && document.documentElement.scrollTop < 1700) {
      gsap.to(" #advantages__image--second", {duration: 2, rotationY: 0, opacity: 1});
      gsap.to(".advantages-block--middle .advantages__title", {duration: 2, opacity: 1, rotationY: 0});
      gsap.to(".advantages-block--middle .advantages__text", {duration: 2, opacity: 1, rotationY: 0});
    } 
    if (document.documentElement.scrollTop > 1500 && document.documentElement.scrollTop < 2150) {
      gsap.to(" #advantages__image--third", {duration: 2, rotationY: 0, opacity: 1});
      gsap.to(".advantages-block--last .advantages__title", {duration: 2, opacity: 1, rotationY: 0});
      gsap.to(".advantages-block--last .advantages__text", {duration: 2, opacity: 1, rotationY: 0});
    } 
    if (document.documentElement.scrollTop > 1900 && document.documentElement.scrollTop < 2450) {
      gsap.to(".quote-block__title", {duration: 2, opacity: 1, rotateX: 0});
    } 
    if (document.documentElement.scrollTop > 2400) {
      gsap.to(".features-block:first-child .features-block__image", {duration: 2, opacity: 1, rotateY: -0, rotateX: 180});
      gsap.to(".features-block:first-child .features-block__title", {duration: 2, opacity: 1, rotateY: 0});
      gsap.to(".features-block--middle .features-block__image", {duration: 2, opacity: 1, delay: 0.5, rotateY: -180, rotateX: -180});
      gsap.to(".features-block--middle .features-block__title", {duration: 2, opacity: 1, delay: 0.5, rotateY: 0});
      gsap.to(".features-block:last-child .features-block__image", {duration: 2, opacity: 1, delay: 1, rotateY: 360, rotateX: -180});
      gsap.to(".features-block:last-child .features-block__title", {duration: 2, opacity: 1, delay: 1, rotateY: 0});
    }
  }  
  if(document.documentElement.clientWidth < 384) {
    if (document.documentElement.scrollTop > 600 && document.documentElement.scrollTop < 1000) {
      gsap.to(" .advantages__heading", {duration: 2, opacity: 1, rotationX: 0});
      gsap.to(" .advantages__line", {duration: 1, rotationY: 0});
    }  
    if (document.documentElement.scrollTop > 800 && document.documentElement.scrollTop < 1450) {
      gsap.to(" #advantages__image--first", {duration: 2, rotationY: 0, opacity: 1});
      gsap.to(".advantages-block--first .advantages__title", {duration: 2, opacity: 1, rotationY: 0});
      gsap.to(".advantages-block--first .advantages__text", {duration: 2, opacity: 1, rotationY: 0});
    } 
    if (document.documentElement.scrollTop > 1350 && document.documentElement.scrollTop < 1950) {
      gsap.to(" #advantages__image--second", {duration: 2, rotationY: 0, opacity: 1});
      gsap.to(".advantages-block--middle .advantages__title", {duration: 2, opacity: 1, rotationY: 0});
      gsap.to(".advantages-block--middle .advantages__text", {duration: 2, opacity: 1, rotationY: 0});
    } 
    if (document.documentElement.scrollTop > 1850 && document.documentElement.scrollTop < 2450) {
      gsap.to(" #advantages__image--third", {duration: 2, rotationY: 0, opacity: 1});
      gsap.to(".advantages-block--last .advantages__title", {duration: 2, opacity: 1, rotationY: 0});
      gsap.to(".advantages-block--last .advantages__text", {duration: 2, opacity: 1, rotationY: 0});
    } 
    if (document.documentElement.scrollTop > 2100 && document.documentElement.scrollTop < 2700) {
      gsap.to(".quote-block__title", {duration: 2, opacity: 1, rotateX: 0});
    } 
    if (document.documentElement.scrollTop > 2500 && document.documentElement.scrollTop < 3000) {
      gsap.to(".features-block:first-child .features-block__image", {duration: 2, opacity: 1, rotateY: -0, rotateX: 180});
      gsap.to(".features-block:first-child .features-block__title", {duration: 2, opacity: 1, rotateY: 0});
    }  
    if (document.documentElement.scrollTop > 2650 && document.documentElement.scrollTop < 3150) {
      gsap.to(".features-block--middle .features-block__image", {duration: 2, opacity: 1, rotateY: -180, rotateX: -180});
      gsap.to(".features-block--middle .features-block__title", {duration: 2, opacity: 1, rotateY: 0});
    }
    if (document.documentElement.scrollTop > 2870) {  
      gsap.to(".features-block:last-child .features-block__image", {duration: 2, opacity: 1, rotateY: 360, rotateX: -180});
      gsap.to(".features-block:last-child .features-block__title", {duration: 2, opacity: 1, rotateY: 0});
    }
  }  
})

