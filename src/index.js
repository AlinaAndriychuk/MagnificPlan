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
          <p className="popup__prompt popup__prompt--top"><img className="popup__prompt-image" src="img/ellipsis.png" alt="description"/>Description</p>
          <textarea className="popup__description" placeholder="Write description to your task" ref={description} defaultValue={props.descValue}></textarea>
          <p className="popup__prompt popup__prompt--middle"><img className="popup__prompt-image" src="img/time.png" alt="time"/>Time estimation</p>
          <textarea className="popup__time" ref={hours} maxLength="3" defaultValue={props.hoursValue}></textarea> 
          <p className="popup__marker">h</p>
          <textarea className="popup__time" ref={minutes} maxLength="2" defaultValue={props.minutesValue}></textarea>
          <p className="popup__marker">m</p>
          <p className="popup__prompt popup__prompt--bottom"><img className="popup__prompt-image" src="img/attachment.png" alt="attachment"/>Attachments</p>
          <label className="popup__file-label">
              <img className="popup__file-image" src="img/paperclip.png" alt="attachment"/>
              <span className="popup__file-title">Add files</span>
            <input className="popup__file" onChange={changeFiles} type="file" multiple/>
          </label>
          <pre className="popup__file-text" ref={files} onKeyPress={props.onKey} contentEditable="">{props.filesValue}</pre>
          <button onClick={() =>{
            props.deleteFunction();
            setFloated(true)
          }} className="popup__button-change"><img className="planner__image" src="img/basket.png" alt="delete"/></button>
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
  let arrayOfColors = ["#ffccd8", "#f2e6ff", "#deefff", "#c0fcdc", "#fffbd9", "#ffffff"];
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
        <input onBlur={save} autoFocus maxLength="17" onKeyPress={textareaKeyPress} ref={textarea} defaultValue={props.titleName} className="planner__textarea"></input>
        <button className="planner__task-button"><img className="planner__image" src="img/ribbon.png" alt="save"/></button>
      </div>
    )
  }
  function renderNormalBlock (){
    return (
      <div className="planner__title-container">
          <div onClick={edit} className="planner__title" title={props.titleName} onKeyPress={textareaKeyPress}>{props.titleName}</div>
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
      <div style={this.props.style} id={this.props.idName} className="planner__board">
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

function MenuBar(props) {
  const [showBar, setShowBar] = useState(false);

  function showBarFunction(){
    setShowBar(true)
  }

  function hidePopup(){
    setShowBar(false)
  }

  function showButton(){
    return (
      <button className="planner-bar__menu" onClick={showBarFunction}>
        <img className="planner-bar__menu-image" alt="menu" src="img/menubar.png"/>
      </button>
    )
  }

  function openAnotherDesk(id) {
    props.changeDesk(id)
    setShowBar(false)
  }

  function deleteTheDesk(id) {
    if(id === 0) {
      setShowBar(false)
    }
    props.deleteDesk(id)
  }

  function showFullBar() {
    return (
      <div className="popup-wrapper deskName-popup">
        <div className="popup">
        <img className="popup__cancel" onClick={hidePopup} src="img/cancel.png" alt="cancel"/>
        <p className="popup__title">Your boards</p>
        <div className="popup__container">
          {
              props.boardDetails.boardFullNames.map ((item,id) => {
                return (
                  <div key={id} className="planner-bar__desk" onClick={()=> openAnotherDesk(id)} style={{background: props.boardDetails.colorsOfBoard[id].split(",")[1] || "#ffffff", color: props.boardDetails.colorOfText[id]}}>
                    <div className="planner-bar__name">
                      <p title={item} className="planner-bar__text">{item}</p>
                    </div>
                    <button className="planner-bar__delete" onClick={(event)=> {
                      event.stopPropagation()
                      deleteTheDesk(id)
                    }}><img className="planner-bar__image" src="img/cancel.png" alt="delete"/></button>
                  </div>
                )
              })
            }
          </div>  
        </div>
      </div>
    )
  }

  if(showBar) {
    document.documentElement.style.overflow = "hidden"; 
    return showFullBar()
  } else {
    document.documentElement.style.overflow = ""; 
    return showButton()
  }
}

function ColumnMenu(props) {

  function showColumnFunction() {
    document.body.addEventListener("click", bodyClick);
    gsap.to(".planner__column-options", { x: -120})
  }

  function bodyClick(event) {
    if(event.target.closest(".planner__column-options")){
      return;
    }
    hidePopup();
  }

  function changeColor(index) {
    hidePopup()
    props.changeBackground(index, true)
  }

  function hidePopup() {
    document.body.removeEventListener("click", bodyClick);
    gsap.to(".planner__column-options", {duration: 1, x: 120})
  }

  function addList() {
    props.addListFunction();
  }

  return (
    <React.Fragment>
      <button className="planner__column-menu" onClick={showColumnFunction}>
        <img className="planner__column-image" alt="Column menu" src="img/columnmenu.png"/>
      </button>
      <div className="planner__column-options">
        <img className="popup__cancel" onClick= {hidePopup} src="img/cancel.png" alt="cancel"/>
          <button className="planner__column-palette">
            {
              props.colorIndexes.map ((item) => {
                return (<div style={props.styleColor[item]} onClick={()=>changeColor(item)} className='planner__palette' key = {item} index={item}></div>)
              })
            }
          </button>     
        <button className="planner__button" onClick={addList}><span className="planner__large-element">+</span> Add list</button>                   
      </div>
    </React.Fragment>
  )
}

function ChooseBar() {
  const [boardDetails, setBoardDetails] = useState({boardFullNames: ["New board"], showPopup: [], titlesOfMiniBoards: ["Todo list", "In progress", "Done"], colorsOfBoard: ["#ffffff"], colorOfText:["#000000"], numberOfLists: [3], colorOfMainDesk:["#ffffff"], displayOfLists: ["block", "block", "block"], currentDesk: [0]});
  const textareaNameOfBoard = useRef(null);
  let numberOfNewMiniBoards = 0;
  const color = useRef(null);
  const mainDesk = useRef(null);
  const colorSpace = useRef(null);
  const colorIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let styleForColor = {}
  let arrayOfColors = ["linear-gradient(180deg, #fc9db5, #ffedf7)", "linear-gradient(180deg, #ffcfda, #e1deff)", "linear-gradient(180deg, #ddc6f5, #e0f0ff)", "linear-gradient(180deg, #c2d7fd, #dafff1)", "linear-gradient(180deg, #b3f6f8, #fbffda)", "linear-gradient(180deg, #fff0cc, #ffe6ff)", "linear-gradient(180deg, #c45a7a, #cf8fd8)", "linear-gradient(180deg, #e498d5, #79639b)", "linear-gradient(180deg, #8b6ba5, #78adeb)", "linear-gradient(180deg, #686ebb, #7dfdfd)", "linear-gradient(180deg, #699fb4, #9dffc9)", "#ffffff"];
  
  let colorOfDeskText = "#000000";
  let colorAddToDetails = "#ffffff";
  let colored = false;

  for (let i = 0; i < arrayOfColors.length; i++){
    
    styleForColor[i] = {
      background: arrayOfColors[i],
    }
  }

  function changeBackground(index, popup) {
    colored = true;
    colorAddToDetails = arrayOfColors[index];
    if(index > 5 && index !== 11) {
      colorOfDeskText = "#ffffff";
    }else {
      colorOfDeskText = "#000000";
    } 

    
    if(popup) {
      changeColorOfDesk()
      gsap.to(mainDesk.current, {background : arrayOfColors[index]})
    } else {
      gsap.to(mainDesk.current, {background : arrayOfColors[index]})
      gsap.to(colorSpace.current, {background : arrayOfColors[index]})
    }
  }

  function changeColorOfDesk() {
    let colorsOfFullBoard = boardDetails.colorsOfBoard;
    let colorsOfText = boardDetails.colorOfText;
    let mainColor = boardDetails.colorOfMainDesk;
    let currentBoard = boardDetails.currentDesk;

    colorsOfFullBoard[currentBoard[0]] = colorAddToDetails;
    colorsOfText[currentBoard[0]] = colorOfDeskText;
    mainColor[0] = colorAddToDetails;


    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: colorsOfFullBoard, colorOfText: colorsOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: mainColor, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk})
  }

  function addList(){
    let titlesOfBoards = boardDetails.titlesOfMiniBoards;
    let numberOfColumns = boardDetails.numberOfLists;
    let displays = boardDetails.displayOfLists;
    let currentBoard = boardDetails.currentDesk;
    let startId = 0;

    for (let i = 0; i <= currentBoard[0]; i++){
      startId += boardDetails.numberOfLists[i];
    }

    if(numberOfColumns[currentBoard[0]] === 3) {
      return;
    } else {
      numberOfColumns[currentBoard[0]] = numberOfColumns[currentBoard[0]] + 1;
      titlesOfBoards.splice(startId, 0, "Column name");
      displays.splice(startId, 0, "block")
    }

    if(document.documentElement.clientWidth >= 861){
      gsap.from(".planner-flex", {duration: 0.8, opacity: 0, marginTop: 400})
    }else {
      gsap.from(".planner-flex", {duration: 1, opacity: 0})
    } 

    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: titlesOfBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: numberOfColumns, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: displays, currentDesk: boardDetails.currentDesk})
  }

  function KeyPressEnter(event) {
    if (event.key === 'Enter') {
       event.target.blur()
    }
  }

  function deleteDesk(id) {
    let namesOfBoards = boardDetails.boardFullNames;
    let titlesOfBoards = boardDetails.titlesOfMiniBoards;
    let colorsOfFullBoard = boardDetails.colorsOfBoard;
    let colorsOfText = boardDetails.colorOfText;
    let numberOfColumns = boardDetails.numberOfLists;
    let mainColor = boardDetails.colorOfMainDesk;
    let displays = boardDetails.displayOfLists;
    let startId = 0;

    for (let i = 0; i < id; i++){
      startId += boardDetails.numberOfLists[i];
    }

    let deleteCurrent

    if(displays[startId + 1] === "block") {
      deleteCurrent = true;
    }

    namesOfBoards.splice(id, 1);
    colorsOfFullBoard.splice(id, 1);
    colorsOfText.splice(id, 1);
    titlesOfBoards.splice(startId, boardDetails.numberOfLists[id]);
    displays.splice(startId, boardDetails.numberOfLists[id])
    numberOfColumns.splice(id, 1);
    mainColor[0] = colorsOfFullBoard[id - 1];

    
    if(deleteCurrent) {
      let nextDesk;
      if(boardDetails.numberOfLists[id - 1]) {
        nextDesk = id - 1;
        gsap.to(mainDesk.current, {background : mainColor[0]});
      } else if (boardDetails.numberOfLists[id]) {
        nextDesk = id;
        gsap.to(mainDesk.current, {background : boardDetails.colorsOfBoard[id]});
      } else {
      displays = [];
        gsap.to(mainDesk.current, {background : ""});
      }
      changeDesk(nextDesk)
    } else {
      let sumOfIndexes = 0;
      let thisDesk = 0;
      for (let i = 0; i < boardDetails.titlesOfMiniBoards.length; i++) {
        sumOfIndexes++
        if(displays[i] === "block") {
          break;
        }
      }
      for(let i = 0; i < boardDetails.numberOfLists.length; i++) {
        thisDesk += boardDetails.numberOfLists[i];
        if(thisDesk >= sumOfIndexes) {
          changeDesk(i)
          break
        }
      }
    }

    if(numberOfColumns.length === 0) {
      for(let every of Array.from(document.getElementsByClassName("planner-bar__add-button"))) {
        every.classList.add("planner-bar__add-button--only")
      }
      document.querySelector(".planner__column-menu").style.display = "none"
      document.querySelector(".planner-bar__menu").classList.add("planner-bar__menu-hide")
    } else {
      for(let every of Array.from(document.getElementsByClassName("planner-bar__add-button"))) {
        gsap.to(every, {display: "inline-block"});
      }
      
    }

    setBoardDetails({boardFullNames: namesOfBoards, showPopup: [], titlesOfMiniBoards: titlesOfBoards, colorsOfBoard: colorsOfFullBoard,colorOfText: colorsOfText, numberOfLists: numberOfColumns, colorOfMainDesk: mainColor, displayOfLists: displays, currentDesk: boardDetails.currentDesk});
  }


  function changeDesk(id) {
    let displays = boardDetails.displayOfLists;
    let currentBoard = boardDetails.currentDesk;
    let startId = 0;

    for (let i = 0; i < id; i++){
      startId += boardDetails.numberOfLists[i];
    }

    for (let i = 0; i <= boardDetails.titlesOfMiniBoards.length; i++) {
      if(i > startId && i < startId + boardDetails.numberOfLists[id] + 1) {
        displays[i] = "block";
      } else {
        displays[i] = "none";
      }
    }

    currentBoard[0] = id

    document.querySelector(".planner-bar__container").scrollTo(0, id * 40);
    gsap.to(mainDesk.current, {background : boardDetails.colorsOfBoard[id]});
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard ,colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: displays, currentDesk: currentBoard});

  }
  
  function showPopup(){
    if(document.documentElement.clientWidth >= 845){
      document.body.style.paddingRight = "16px";
    } 
    gsap.to(document.documentElement, {overflow: "hidden"})
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [true], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk})
  }
  function changeTitleOfList(title, index){
    let titlesOfBoards = boardDetails.titlesOfMiniBoards;
    titlesOfBoards[index] = title;
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: titlesOfBoards, colorsOfBoard: boardDetails.colorsOfBoard ,colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk});
  }

  function hidePopup(event) {
    let namesOfBoards = boardDetails.boardFullNames;
    let titlesOfBoards = boardDetails.titlesOfMiniBoards;
    let colorsOfFullBoard = boardDetails.colorsOfBoard;
    let colorsOfText = boardDetails.colorOfText;
    let numberOfColumns = boardDetails.numberOfLists;
    let mainColor = boardDetails.colorOfMainDesk;
    let displays = boardDetails.displayOfLists;
    let currentBoard = boardDetails.currentDesk;

    if(!event){
      if(colored) {
        colorsOfFullBoard.push(colorAddToDetails);
        colorsOfText.push(colorOfDeskText);
        mainColor[0] = colorAddToDetails;
      } else {
        mainDesk.current.style.backgroundColor = "#ffffff";
        colorsOfFullBoard.push("#ffffff");
        colorsOfText.push("#000000");
        mainColor[0] = "#ffffff"
      }
      namesOfBoards.push(textareaNameOfBoard.current.value);
      numberOfColumns.push(numberOfNewMiniBoards);
      let lengthOfLists = boardDetails.titlesOfMiniBoards.length + 1;
      for (let i = 0; i < lengthOfLists; i++) {
        displays[i] = "none"
      }
      for(let i = 0; i < numberOfNewMiniBoards; i++) {
        titlesOfBoards.push("Column name");
      }
      for(let i = 0; i <= numberOfNewMiniBoards; i++) {
        displays.push("block")
      }
      
      if(document.documentElement.clientWidth >= 861){
        gsap.from(".planner-flex", {duration: 0.8, opacity: 0, marginTop: 400})
      }else {
        gsap.from(".planner-flex", {duration: 1, opacity: 0})
      }  
      if(numberOfColumns.length > 4) {
        for(let every of Array.from(document.getElementsByClassName("planner-bar__add-button"))) {
          every.style.display= "none";
        }
      } else {
        for(let every of Array.from(document.getElementsByClassName("planner-bar__add-button"))) {
          every.classList.remove("planner-bar__add-button--only")
        }
        document.querySelector(".planner-bar__menu").classList.remove("planner-bar__menu-hide")
      }
      currentBoard[0] = namesOfBoards.length - 1
      document.querySelector(".planner-bar__container").scrollTo(0, (numberOfColumns.length - 1) * 40);
      document.querySelector(".planner__column-menu").style.display = "inline-block"
    }
    colored = false;
    
    document.body.style.paddingRight = "0px";
    document.documentElement.style.overflow = ""; 
    gsap.to(mainDesk.current, {background : mainColor[0]});
    setBoardDetails({boardFullNames: namesOfBoards, showPopup: [], titlesOfMiniBoards: titlesOfBoards, colorsOfBoard: colorsOfFullBoard,colorOfText: colorsOfText, numberOfLists: numberOfColumns, colorOfMainDesk: mainColor, displayOfLists: displays, currentDesk: currentBoard})
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

  function slideTheDesk(event) {

    if(document.documentElement.clientWidth <= 843 ) return;

    let numberOfColumns = boardDetails.numberOfLists;
    let displays = boardDetails.displayOfLists;
    let currentBoard = boardDetails.currentDesk;
    let mainColor = boardDetails.colorOfMainDesk;
    let sideOfSliding;
    if(event.target.closest(".planner__arrow--right")) {
      sideOfSliding = "right"
    } else {
      sideOfSliding = "left"
    }

    let startId = 0;

    for (let i = 0; i <= currentBoard[0]; i++){
      startId += boardDetails.numberOfLists[i];
    }

    let nextDesk;
    if(sideOfSliding === "right") {
      nextDesk = currentBoard[0] + 1;
    }else {
      nextDesk = currentBoard[0] - 1;
    }

    if(!boardDetails.numberOfLists[nextDesk]) return
    for (let i = 0; i <= boardDetails.titlesOfMiniBoards.length; i++) {
      if(sideOfSliding === "right") {
        if(i > startId && i < startId + boardDetails.numberOfLists[nextDesk] + 1) {
          displays[i] = "block";
        } else {
          displays[i] = "none";
        }
      } else {
        if(i > startId - boardDetails.numberOfLists[currentBoard[0]] - boardDetails.numberOfLists[nextDesk] && i < startId - boardDetails.numberOfLists[currentBoard[0]] + 1) {
          displays[i] = "block";
        } else {
          displays[i] = "none";
        }
      }
    }

    let newSpace = document.createElement("div");
    newSpace.className = "planner-fullSpace";
    newSpace.style.height = mainDesk.current.clientHeight + "px";
    newSpace.style.background = boardDetails.colorsOfBoard[nextDesk];
    mainDesk.current.before(newSpace)
    if(sideOfSliding === "right") {
      newSpace.style.right = 0;
    } else {
      newSpace.style.left = 0;
    }
    gsap.to(newSpace, {duration : 1, width: "100%"});
    gsap.to(mainDesk.current, {duration : 0, delay: 1.1, background: boardDetails.colorsOfBoard[nextDesk]});
    setTimeout(() => newSpace.remove(), 1100);
    gsap.to(".planner__board", {duration : 0, delay: 1, opacity: 0});

    mainColor[0] = boardDetails.colorsOfBoard[nextDesk];

    currentBoard[0] = nextDesk;
    let startOfNewLists = 0;

    for (let i = 0; i <= currentBoard[0]; i++){
      startOfNewLists += boardDetails.numberOfLists[i];
    }

    let nextLists = [];
    for (let i = 0; i <= boardDetails.titlesOfMiniBoards.length; i++) {
      if(i < startOfNewLists && i >= startOfNewLists - boardDetails.numberOfLists[currentBoard[0]]) {
        let idBoard = "#board" + (i + 1);
        nextLists.push(idBoard)
      }
    }

    if(sideOfSliding === "right") {
      gsap.to(".planner__board", {duration : 1, delay: 1.4, opacity: 1});
      gsap.to(nextLists[0], {duration : 1, delay: 1, opacity: 1});
      if(nextLists[1]) gsap.to(nextLists[1], {duration : 1, delay: 1.2, opacity: 1});
    } else {
      gsap.to(".planner__board", {duration : 1, delay: 1.4, opacity: 1});
      gsap.to(nextLists[0], {duration : 1, delay: 1.4, opacity: 1});
      if(nextLists[1]) gsap.to(nextLists[1], {duration : 1, delay: 1.2, opacity: 1});
      if(nextLists[2]) gsap.to(nextLists[2], {duration : 1, delay: 1, opacity: 1});
    }

    setTimeout(()=> {
      setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: numberOfColumns, colorOfMainDesk: mainColor, displayOfLists: displays, currentDesk: currentBoard})
    }, 1000)
    // for (let i = 0; i <= boardDetails.titlesOfMiniBoards.length; i++) {
    //   if(i < startId && i >= startId - boardDetails.numberOfLists[currentBoard[0]]) {
    //     let idBoard = "#board" + (i + 1);
    //     columns.push(idBoard)
    //   }
    // }

    // mainColor[0] = boardDetails.colorsOfBoard[nextDesk]

    // gsap.to(".planner__box", {display: "block", opacity: 1, width: 170})
    // gsap.to(".planner-flex", {marginLeft: "auto", marginRight: "auto"});
    // gsap.to(".planner-flex", {duration: 1.3, delay: 0.9, width: "30px"});
    // gsap.to(".planner__board", {duration: 0.3, delay: 0.3, opacity: 0, display: "none"});

    // setTimeout(()=> {
    //   for (let i = 0; i < columns.length; i++){
    //     let image = document.createElement("img");
    //     image.src = "img/imgAnimate.png";
    //     image.alt = "animation";
    //     image.className = "planner__animation-image";
    //     document.querySelector(columns[i]).after(image);
    //   }
    //   gsap.to(".planner__animation-image", {duration:0, opacity: 0, height:"100%"})
    //   gsap.to(columns[0] + " + .planner__animation-image", {duration: 1, opacity: 1, delay: 0.5, rotationZ: 90, width: 64})
    //   gsap.to(columns[0] + " + .planner__animation-image", {duration: 1, delay: 0.7, marginTop: 380, width: 30})

      

    //   if(columns[2]) {
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 0.8, opacity: 1, rotationZ: 120, width: 64})
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 1.3, delay: 0.2, marginTop: 380, width: 30})
    //     gsap.to( columns[2] + " + .planner__animation-image", {duration: 1, opacity: 1, delay: 0.3, rotationZ: 200, width: 64})
    //     gsap.to( columns[2] + " + .planner__animation-image", {duration: 1, delay: 0.6, marginTop: 380, width: 30})
    //   } else if(columns[1]) {
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 1.3, opacity: 1, rotationZ: 190, width: 64})
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 1, delay: 0.4, marginTop: 380, width: 30})
    //   }

    // }, 600)
  
    
    // gsap.to(mainDesk.current, {delay: 2, background : mainColor[0]});
    
    // setTimeout(()=> {
    //   setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: numberOfColumns, colorOfMainDesk: mainColor, displayOfLists: displays, currentDesk: boardDetails.currentDesk})
    //   endAnimation()
    // }, 2000)

    // function endAnimation(){
    //   currentBoard[0] = nextDesk;

    //   let startId = 0;

    //   for (let i = 0; i <= currentBoard[0]; i++){
    //     startId += boardDetails.numberOfLists[i];
    //   }

    //   let nextLists = [];
    //   for (let i = 0; i <= boardDetails.titlesOfMiniBoards.length; i++) {
    //     if(i < startId && i >= startId - boardDetails.numberOfLists[currentBoard[0]]) {
    //       let idBoard = "#board" + (i + 1);
    //       nextLists.push(idBoard)
    //     }
    //   }
      
    //   let arrayOfImagesBefore = Array.from(document.querySelectorAll(".planner__animation-image"))

    //   if(columns[1] && nextLists[2] && !columns[2]) {
    //     columns[2] = nextLists[2]
    //     let image = document.createElement("img");
    //     image.src = "img/imgAnimate.png";
    //     image.alt = "animation";
    //     image.className = "planner__animation-image";
    //     document.querySelector(columns[2]).after(image);
    //     gsap.to( columns[2] + " + .planner__animation-image", {duration: 0, marginTop: 380, width: 30, height:"100%"})
    //   } else if (!columns[1] && nextLists[2]) {
    //     columns[1] = nextLists[1]
    //     columns[2] = nextLists[2]
    //     for(let i = 1; i < 3; i++) {
    //       let image = document.createElement("img");
    //       image.src = "img/imgAnimate.png";
    //       image.alt = "animation";
    //       image.className = "planner__animation-image";
    //       document.querySelector(columns[i]).after(image);
    //     }
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 0, marginTop: 380, width: 30, height:"100%"})
    //     gsap.to( columns[2] + " + .planner__animation-image", {duration: 0, marginTop: 380, width: 30, height:"100%"})
    //   } else if (columns[2] && !nextLists[2] && nextLists[1]) {
    //     columns[2] = false
    //     arrayOfImagesBefore[2].remove()  
    //   } else if (!columns[1] && nextLists[1]) {
    //     columns[1] = nextLists[1]
    //     let image = document.createElement("img");
    //     image.src = "img/imgAnimate.png";
    //     image.alt = "animation";
    //     image.className = "planner__animation-image";
    //     document.querySelector(columns[1]).after(image);
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 0, marginTop: 380, width: 30, height:"100%"})
    //   } else if (columns[2] && !nextLists[1]) {
    //     columns[1] = false;
    //     columns[2] = false;
    //     arrayOfImagesBefore[1].remove()  
    //     arrayOfImagesBefore[2].remove()  
    //   } else if (columns[1] && !nextLists[1]) {
    //     columns[1] = false;
    //     arrayOfImagesBefore[1].remove()  
    //   }

    //   let arrayOfImagesAfter = Array.from(document.querySelectorAll(".planner__animation-image"))

    //   if(columns[2] ) {
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 1.5, rotationZ: -20})
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 1.2, delay: 0.4, marginTop: 0, width: 64})
    //     gsap.to(columns[1] + " + .planner__animation-image", {duration: 0.3, delay: 1.4, opacity: 0})
    //     setTimeout(()=> arrayOfImagesAfter[1].remove(), 2000)
    //     gsap.to( columns[2] + " + .planner__animation-image", {duration: 0.5, delay: 0.5, rotationZ: 30})
    //     gsap.to( columns[2] + " + .planner__animation-image", {duration: 1.3, delay: 0.7, marginTop: 0, width: 64})
    //     gsap.to(columns[2] + " + .planner__animation-image", {duration: 0.2, delay: 1.8, opacity: 0})
    //     setTimeout(()=> arrayOfImagesAfter[2].remove(), 2000)
    //   } else if (columns[1]) {
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 1.5, rotationZ: -20})
    //     gsap.to( columns[1] + " + .planner__animation-image", {duration: 1.2, delay: 0.4, marginTop: 0, width: 64})
    //     gsap.to(columns[1] + " + .planner__animation-image", {duration: 0.3, delay: 1.4, opacity: 0})
    //     setTimeout(()=> arrayOfImagesAfter[1].remove(), 2000)
    //   }
   
    //   gsap.to(".planner-flex", {duration: 1, delay: 0.9, width: "100%"});
    //   gsap.to(".planner__board", {duration: 0, display: "none"})

    //   gsap.to(columns[0] + " + .planner__animation-image", {duration: 1, delay: 0.6, rotationZ: 270})
    //   gsap.to(columns[0] + " + .planner__animation-image", {duration: 1, delay: 0.8, marginTop: 0, width: 64})
    //   gsap.to(columns[0] + " + .planner__animation-image", {duration: 0.3, delay: 1.6, opacity: 0})
    //   setTimeout(()=> arrayOfImagesAfter[0].remove(), 2000)

    //   gsap.to(nextLists[0], { display: "block", delay: 2})
    //   gsap.to(".planner__board", { delay: 2.1, opacity: 1})
    //   gsap.to(".planner__box", { delay: 1, opacity: 0, display: "none"})
    //   if(nextLists[1]) gsap.to(nextLists[1], { display: "block",delay: 2})
    //   if(nextLists[2]) gsap.to(nextLists[2], { display: "block",delay: 2})

    // }

    // setTimeout(() => {
    //   setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard ,colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: currentBoard})
    // }, 2100)
  }
  
  return (
    <React.Fragment>
        <div className= "planner-bar">
              {
                boardDetails.boardFullNames.map ((item,id) => {
                  return (
                    <div key={id} className="planner-bar__desk" onClick={()=> changeDesk(id)} style={{background: boardDetails.colorsOfBoard[id].split(",")[1] || "#ffffff", color: boardDetails.colorOfText[id]}}>
                      <div className="planner-bar__name">
                        <p title={item} className="planner-bar__text">{item}</p>
                      </div>
                      <button className="planner-bar__delete" onClick={(event)=> {
                        event.stopPropagation()
                        deleteDesk(id)
                      }}><img className="planner-bar__image" src="img/cancel.png" alt="delete"/></button>
                    </div>
                  )
                })
              }
          <button className="planner-bar__add-button" onClick={showPopup}>+</button>
        </div>
        <div className= "planner-bar-small">
          <MenuBar boardDetails={boardDetails} deleteDesk={deleteDesk} changeDesk={changeDesk}></MenuBar>
          <div className="planner-bar__container">
            <div className="planner__list">
              {
                boardDetails.boardFullNames.map ((item,id) => {
                  return (
                    <div key={id} className="planner-bar__desk" onClick={()=> changeDesk(id)} style={{background: boardDetails.colorsOfBoard[id].split(",")[1] || "#ffffff", color: boardDetails.colorOfText[id]}}>
                      <div className="planner-bar__name">
                        <p title={item} className="planner-bar__text">{item}</p>
                      </div>
                      <button className="planner-bar__delete" onClick={(event)=> {
                        event.stopPropagation()
                        deleteDesk(id)
                      }}><img className="planner-bar__image" src="img/cancel.png" alt="delete"/></button>
                    </div>
                  )
                })
              }
            </div>
          </div>
          <button className="planner-bar__add-button" onClick={showPopup}>+</button>
        </div>
        {
            boardDetails.showPopup.map ((item, id) => {
              return (
                <div key= {id} className="popup-wrapper desk-popup">
                  <div className="popup">
                    <img className="popup__cancel" onClick={hidePopup} src="img/cancel.png" alt="cancel"/>
                    <textarea autoFocus maxLength="17" ref={textareaNameOfBoard} placeholder="Board name" onKeyPress={KeyPressEnter} className="popup__textarea-board"></textarea>
                    <p className="popup__prompt"><img className="popup__prompt-image" src="img/numbers.png" alt="numbers"/>Number of columns</p>
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
                    <p className="popup__prompt"><img className="popup__prompt-image" src="img/color.png" alt="color"/>Color of board</p>
                    <button className="planner__palette-button">
                        {
                          colorIndexes.map ((item) => {
                            return (<div onClick={()=> changeBackground(item)} ref={color} style={styleForColor[item]} className='planner__palette' key = {item} index={item}></div>)
                          })
                        }
                      </button>
                    <div ref={colorSpace} className="popup__colorSpace"></div>
                    <button onClick={desideToHidePopup} className="popup__button">
                      Create
                    </button>
                  </div>
                </div>
              )
            })
          }
        <div ref={mainDesk} className= "planner-full-board">
          <ColumnMenu addListFunction={addList} changeBackground={changeBackground} styleColor={styleForColor} colorIndexes={colorIndexes}></ColumnMenu>
          <button onClick={slideTheDesk} className="planner__arrow planner__arrow--left">
            <img src="img/leftarrow.png" alt="arrow" className="planner__arrow-image"/>
          </button>
          <button onClick={slideTheDesk} className="planner__arrow planner__arrow--right">
            <img src="img/rightarrow.png" alt="arrow" className="planner__arrow-image"/>
          </button>
          <div className="planner-flex">
            {
              boardDetails.titlesOfMiniBoards.map ((item, id) => {
                return (
                  <Blockfield key = {id} index={id} idName={"board" + ++id} changeTitle={changeTitleOfList} style={{display: boardDetails.displayOfLists[id]}}  titleName={item}></Blockfield>
                )
              })
            }
          </div>
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
    gsap.to(elem, { boxShadow: " 7px 7px 5px #776183"})
  }

  function leaveDroppable(elem) {
    gsap.to(elem, { boxShadow: "none"})
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
    element.style.zIndex = 30;
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

  gsap.from("#board1", {duration: 0.8, marginTop: 380, opacity: 0});
  gsap.from(" #board1 .planner__title, #board1 .planner__button", {duration: 0.8, delay: 0.8, opacity: 0});
  gsap.from("#board2", {duration: 0.8, delay: 0.7, marginTop: 380, opacity: 0});
  gsap.from(" #board2 .planner__title, #board2 .planner__button", {duration: 0.8, delay: 1.5, opacity: 0});
  gsap.from("#board3", {duration: 0.8, delay: 1.5, marginTop: 380, opacity: 0});
  gsap.from(" #board3 .planner__title, #board3 .planner__button", {duration: 0.8, delay: 2.3, opacity: 0});
} else {
  gsap.from(".header__item:first-child", {duration: 2, y: 200});
  gsap.from(".header__item:last-child", {duration: 2, y: -200});

  gsap.from("#board1", {duration: 0.8, opacity: 0});
  gsap.from(" #board1 .planner__title, #board1 .planner__button", {duration: 0.8, delay: 0.8, opacity: 0});
  gsap.from("#board2", {duration: 0.8, delay: 0.7, opacity: 0});
  gsap.from(" #board2 .planner__title, #board2 .planner__button", {duration: 0.8, delay: 1.5, opacity: 0});
  gsap.from("#board3", {duration: 0.8, delay: 1.5, opacity: 0});
  gsap.from(" #board3 .planner__title, #board3 .planner__button", {duration: 0.8, delay: 2.3, opacity: 0});
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
      gsap.to(" .advantages__line", {duration: 3, rotationY: 0});
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
    if (document.documentElement.scrollTop > 2200) {
      gsap.to(".footer__link", {duration: 1, backgroundColor: "#fcfafb83"});
    }
  }
  if(document.documentElement.clientWidth < 845 && document.documentElement.clientWidth >= 384 ) {
    if (document.documentElement.scrollTop > 400 && document.documentElement.scrollTop < 900) {
      gsap.to(" .advantages__heading", {duration: 2, opacity: 1, rotationX: 0});
      gsap.to(" .advantages__line", {duration: 3, rotationY: 0});
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
    if (document.documentElement.scrollTop > 2400) {
      gsap.to(".footer__link", {duration: 1, backgroundColor: "#fcfafb83"});
    }
  }  
  if(document.documentElement.clientWidth < 384) {
    if (document.documentElement.scrollTop > 600 && document.documentElement.scrollTop < 1000) {
      gsap.to(" .advantages__heading", {duration: 2, opacity: 1, rotationX: 0});
      gsap.to(" .advantages__line", {duration: 3, rotationY: 0});
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
    if (document.documentElement.scrollTop > 2800) {
      gsap.to(".footer__link", {duration: 1, backgroundColor: "#fcfafb83"});
    }
  }  
})

