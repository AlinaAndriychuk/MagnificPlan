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
    props.saveFunction( props.blockId, taskName.current.innerText, props.taskIndex, description.current.value, hours.current.value, minutes.current.value, files.current.innerHTML)
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
          <p className="popup__prompt "><img className="popup__prompt-image" src="img/ellipsis.png" alt="description"/>Description</p>
          <textarea className="popup__description" placeholder="Write description to your task" ref={description} defaultValue={props.descValue}></textarea>
          <p className="popup__prompt popup__prompt--middle"><img className="popup__prompt-image" src="img/time.png" alt="time"/>Time estimation</p>
          <textarea className="popup__time" ref={hours} maxLength="3" defaultValue={props.hoursValue}></textarea> 
          <p className="popup__marker">h</p>
          <textarea className="popup__time" ref={minutes} maxLength="2" defaultValue={props.minutesValue}></textarea>
          <p className="popup__marker">m</p>
          <p className="popup__prompt"><img className="popup__prompt-image" src="img/attachment.png" alt="attachment"/>Attachments</p>
          <label className="popup__file-label">
              <img className="popup__file-image" src="img/paperclip.png" alt="attachment"/>
              <span className="popup__file-title">Add files</span>
            <input className="popup__file" onChange={changeFiles} type="file" multiple/>
          </label>
          <pre className="popup__file-text" ref={files} onKeyPress={props.onKey} contentEditable="">{props.filesValue}</pre>
          <button onClick={(event) =>{
            props.deleteFunction(event);
            setFloated(true)
          }} className="popup__button-change"><img className="planner__image" src="img/basket.png" alt="delete"/></button>
          <Colorpalette blockfieldIndex={props.blockfieldIndex} blockId={props.blockId} colorFunction={props.colorFunction} ></Colorpalette>
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
  let arrayOfColors = ["#ffafc2", "#ecdaff", "#c7e4ff", "#9fffcc", "#fffac8", "#ffffff"];
  for (let i = 0; i < 6; i++){
    styleForColor[i] = {
      backgroundColor: arrayOfColors[i],
    }
  }

  function changeBackground(index) {
    props.colorFunction( arrayOfColors[index], props.blockfieldIndex, props.blockId)
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
  
  const [edited, setEdited] = useState(true);
  const textarea = useRef(null);

  function edit() {
    setEdited(false)
  }
  function remove(event) {
    props.deleteFunction( props.index, props.idOfBlock);
  }
  function save(){
    let newValue = textarea.current.value;
    setEdited(true) 
    if(!newValue) newValue = textarea.current.placeholder
    props.updateFunction(props.idOfBlock, newValue, props.index)
  }
  function textareaKeyPress(event) {
    if (event.key === 'Enter') {
      save()
    }
  }
  function renderEditBlock (){
    return (
      <div className="planner__task">
        <textarea autoFocus onBlur={save} onKeyPress={textareaKeyPress} ref={textarea} placeholder={props.taskName} className="planner__textarea"></textarea>
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
      indexOfTask = props.index;
      idOfBoardOfTask = props.idOfBlock;
    }
  }
  function hideBasket(event){
    let basket = document.getElementsByClassName("planner__delete-button")[0];
    gsap.to(basket, {left: -100, rotateZ: 0, display: "none"});
    if(deleteTask){
      remove(event)
      deleteTask = false;
    }
  }
  function renderNormalBlock (){
    return (
      <div id = {props.id} style={styleOfBlock} className="planner__task">
        <p onMouseUp={hideBasket} onMouseDown={showBasket} className="planner__task-text">{props.taskName}</p>
        <button onClick={edit} className="planner__task-button--edit"><img className="planner__image" src="img/pencil.png" alt="edit"/></button>
        <PopupBlock taskIndex={props.index} blockId= {props.idOfBlock} filesValue={props.files} hoursValue={props.hours} minutesValue={props.minutes} onKey={props.onKeyPressFunction} descValue={props.descriptionValue} saveFunction={props.updateFunction} styleOfBlock={styleOfBlock} deleteFunction={remove} blockfieldIndex={props.index} colorFunction={props.colorFunction}  styleTask={styleOfBlock} taskName={props.taskName}></PopupBlock>
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
    props.changeTitle( newValue, props.index)
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


function MenuBar(props) {
  const [showBar, setShowBar] = useState(false);

  function showBarFunction(){
    document.getElementsByClassName("planner-bar-small")[0].style.paddingLeft = "37px";
    setShowBar(true)
  }

  function hidePopup(){
    document.getElementsByClassName("planner-bar-small")[0].style.paddingLeft = "0px";
    setShowBar(false)
  }

  function showButton(){
    return (
      <button className="planner-bar__menu" onClick={showBarFunction} style={{display: deisplayOfSmallMenu}}>
        <img className="planner-bar__menu-image" alt="menu" src="img/menubar.png"/>
      </button>
    )
  }

  function openAnotherDesk(id) {
    props.changeDesk(id)
     hidePopup()
  }

  function deleteTheDesk(id) {
    if(id === 0) {
      hidePopup()
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

let deisplayOfSmallMenu = "";

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
  const [boardDetails, setBoardDetails] = useState({boardFullNames: ["New board"], showPopup: [], titlesOfMiniBoards: ["Todo list", "In progress", "Done"], colorsOfBoard: ["#ffffff"], colorOfText:["#000000"], numberOfLists: [3], colorOfMainDesk:["#ffffff"], displayOfLists: ["block", "block", "block"], currentDesk: [0], blockField: [{tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}, {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []}]});
  const textareaNameOfBoard = useRef(null);
  let numberOfNewMiniBoards = 0;
  const color = useRef(null);
  const mainDesk = useRef(null);
  const colorSpace = useRef(null);
  const colorIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  let styleForColor = {}
  let arrayOfColors = ["linear-gradient(180deg, #fc9db5, #ffedf7)", "linear-gradient(180deg, #ffcfda, #e1deff)", "linear-gradient(180deg, #ddc6f5, #e0f0ff)", "linear-gradient(180deg, #c2d7fd, #eff8fc)", "linear-gradient(180deg, #8dd4c9, #ccffca)", "linear-gradient(180deg, #fff0cc, #ffe6ff)", "linear-gradient(180deg, #c45a7a, #cf8fd8)", "linear-gradient(180deg, #e498d5, #79639b)", "linear-gradient(180deg, #8b6ba5, #78adeb)", "linear-gradient(180deg, #686ebb, #7dfdfd)", "linear-gradient(180deg, #699fb4, #9dffc9)", "#ffffff"];
  
  let colorOfDeskText = "#000000";
  let colorAddToDetails = "#ffffff";
  let colored = false;

  for (let i = 0; i < arrayOfColors.length; i++){
    
    styleForColor[i] = {
      background: arrayOfColors[i],
    }
  }

  function addBlock (text, color, desc, hours, minutes, files, id) {
    let fullBlockField = boardDetails.blockField;
    let newBlockField = boardDetails.blockField[id]
    newBlockField.tasks.push(text);
    newBlockField.colors.push(color);
    newBlockField.description.push(desc);
    newBlockField.hours.push(hours);
    newBlockField.minutes.push(minutes);
    newBlockField.files.push(files);
    fullBlockField[id] = newBlockField;
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk, blockField: fullBlockField})
  }
  function changeColorOfBlock(color, index, id){
    let fullBlockField = boardDetails.blockField;
    let newBlockField = boardDetails.blockField[id]
    newBlockField.colors[index] = color;
    fullBlockField[id] = newBlockField;
    setBoardDetails ({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk, blockField: fullBlockField})
  }
  function deleteBlock(index, id) {
    let fullBlockField = boardDetails.blockField;
    let newBlockField = boardDetails.blockField[id];
    newBlockField.tasks.splice(index, 1);
    newBlockField.colors.splice(index, 1);
    newBlockField.description.splice(index, 1);
    newBlockField.hours.splice(index, 1);
    newBlockField.minutes.splice(index, 1);
    newBlockField.files.splice(index, 1);
    fullBlockField[id] = newBlockField;
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk, blockField: fullBlockField})
  }
  function updateTextInBlock( id, text, index, desc, hours, minutes, files) {
    let fullBlockField = boardDetails.blockField;
    let newBlockField = boardDetails.blockField[id];
    newBlockField.tasks[index] = text;
    if(desc === "" || desc) newBlockField.description[index] = desc;
    if(hours === "" || hours) newBlockField.hours[index] = hours;
    if(minutes === "" || minutes) newBlockField.minutes[index] = minutes;
    if(files === "" || files) newBlockField.files[index] = files;
    fullBlockField[id] = newBlockField;
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk, blockField: fullBlockField})
  }
  function containNewTask() {
    if(!containTask) return;

    let fullBlockField = boardDetails.blockField;
    let oldBlockField = boardDetails.blockField[idOfBoardOfTask];
    let task = oldBlockField.tasks.splice(indexOfTask, 1);
    let color = oldBlockField.colors.splice(indexOfTask, 1);
    let desc = oldBlockField.description.splice(indexOfTask, 1);
    let hours = oldBlockField.hours.splice(indexOfTask, 1);
    let minutes = oldBlockField.minutes.splice(indexOfTask, 1);
    let files = oldBlockField.files.splice(indexOfTask, 1);

    let selectorOfNewBoard = taskAfterBoard.split("d")[1] - 1;
    let newBlockField = fullBlockField[selectorOfNewBoard];
    let selectorOfTaskIndex
    if(taskAfter) {
      selectorOfTaskIndex = Number(taskAfter.split("task")[1] ) + 1;
    } else {
      selectorOfTaskIndex = newBlockField.tasks.length;
    }

    newBlockField.tasks.splice(selectorOfTaskIndex, 0, task);
    newBlockField.colors.splice(selectorOfTaskIndex, 0, color);
    newBlockField.description.splice(selectorOfTaskIndex, 0, desc);
    newBlockField.hours.splice(selectorOfTaskIndex, 0, hours);
    newBlockField.minutes.splice(selectorOfTaskIndex, 0, minutes);
    newBlockField.files.splice(selectorOfTaskIndex, 0, files);

    fullBlockField[idOfBoardOfTask] = oldBlockField;
    fullBlockField[selectorOfNewBoard] = newBlockField;
    containTask = false;
    taskAfter = "";
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk, blockField: fullBlockField})
  }
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.target.blur()
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


    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: colorsOfFullBoard, colorOfText: colorsOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: mainColor, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk, blockField: boardDetails.blockField})
  }

  function addList(){
    let titlesOfBoards = boardDetails.titlesOfMiniBoards;
    let numberOfColumns = boardDetails.numberOfLists;
    let displays = boardDetails.displayOfLists;
    let currentBoard = boardDetails.currentDesk;
    let fullBlockField = boardDetails.blockField;
    let startId = 0;

    for (let i = 0; i <= currentBoard[0]; i++){
      startId += boardDetails.numberOfLists[i];
    }

    if(numberOfColumns[currentBoard[0]] === 3) return ;

    numberOfColumns[currentBoard[0]] = numberOfColumns[currentBoard[0]] + 1;
    titlesOfBoards.splice(startId, 0, "Column name");
    displays.splice(startId, 0, "block")

    fullBlockField.splice(startId, 0, fullBlockField[fullBlockField.length - 1])
    fullBlockField.pop()

    if(document.documentElement.clientWidth >= 861){
      gsap.from(".planner-flex", {duration: 0.8, opacity: 0, marginTop: 400})
    }else {
      gsap.from(".planner-flex", {duration: 1, opacity: 0})
    } 
    gsap.to(".planner__slider-button-container", {duration: 0, display: ""})
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: titlesOfBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: numberOfColumns, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: displays, currentDesk: boardDetails.currentDesk, blockField: fullBlockField})
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
    let fullBlockField = boardDetails.blockField;
    let startId = 0;

    for (let i = 0; i < id; i++){
      startId += boardDetails.numberOfLists[i];
    }

    for(let i = 0; i < fullBlockField.length; i++) {
      if( i >= startId && i < startId + boardDetails.numberOfLists[id]) {
        let newBlockField = fullBlockField[i];
        newBlockField = {tasks: [], colors: [], description: [], hours: [], minutes: [], files: []};
        fullBlockField[i] = newBlockField;
      }
    }

    namesOfBoards.splice(id, 1);
    colorsOfFullBoard.splice(id, 1);
    colorsOfText.splice(id, 1);
    titlesOfBoards.splice(startId, boardDetails.numberOfLists[id]);
    displays.splice(startId, boardDetails.numberOfLists[id])
    numberOfColumns.splice(id, 1);
    mainColor[0] = colorsOfFullBoard[id - 1] || colorsOfFullBoard[id] || "#ffffff";
    
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

    if(numberOfColumns.length === 0) {
      for(let every of Array.from(document.getElementsByClassName("planner-bar__add-button"))) {
        every.classList.add("planner-bar__add-button--only")
      }
      document.querySelector(".planner").style.marginTop = "40px"
      document.querySelector(".planner-full-board").style.background = "#ffffff";
      deisplayOfSmallMenu = "none"
      document.querySelector(".planner__column-menu").style.display = "none";
      gsap.to(".planner__slider-button-container", {duration: 0, display: "none"})

    } else {
      for(let every of Array.from(document.getElementsByClassName("planner-bar__add-button"))) {
        gsap.to(every, {display: "inline-block"});
      }
      
    }

    setBoardDetails({boardFullNames: namesOfBoards, showPopup: [], titlesOfMiniBoards: titlesOfBoards, colorsOfBoard: colorsOfFullBoard,colorOfText: colorsOfText, numberOfLists: numberOfColumns, colorOfMainDesk: mainColor, displayOfLists: displays, currentDesk: boardDetails.currentDesk, blockField: fullBlockField});
  }


  function changeDesk(id) {
    let displays = boardDetails.displayOfLists;
    let currentBoard = boardDetails.currentDesk;
    let startId = 0;

    for (let i = 0; i < id; i++){
      startId += boardDetails.numberOfLists[i];
    }

    for (let i = 0; i <= boardDetails.titlesOfMiniBoards.length; i++) {
      if(i > startId - 1 && i < startId + boardDetails.numberOfLists[id]) {
        displays[i] = "block";
      } else {
        displays[i] = "none";
      }
    }

    currentBoard[0] = id;

    let flexContainer = document.querySelector(".planner-flex");
    flexContainer.scrollTo(0, 0);

    if(boardDetails.numberOfLists[id] > 1) {
      gsap.to(".planner__slider-button-container", {duration: 0, display: ""})
    } else {
      gsap.to(".planner__slider-button-container", {duration: 0, display: "none"})
    }

    document.querySelector(".planner-bar__container").scrollTo(0, id * 40);
    gsap.to(mainDesk.current, {background : boardDetails.colorsOfBoard[id]});
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard ,colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: displays, currentDesk: currentBoard,blockField: boardDetails.blockField});

  }
  
  function showPopup(){
    if(document.documentElement.clientWidth >= 845){
      document.documentElement.style.paddingRight = "16px";
    } 
    gsap.to(document.documentElement, {overflow: "hidden"})
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [true], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk, blockField: boardDetails.blockField})
  }
  function changeTitleOfList(title, index){
    let titlesOfBoards = boardDetails.titlesOfMiniBoards;
    titlesOfBoards[index] = title;
    setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: titlesOfBoards, colorsOfBoard: boardDetails.colorsOfBoard ,colorOfText: boardDetails.colorOfText, numberOfLists: boardDetails.numberOfLists, colorOfMainDesk: boardDetails.colorOfMainDesk, displayOfLists: boardDetails.displayOfLists, currentDesk: boardDetails.currentDesk, blockField: boardDetails.blockField});
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
      for (let i = 0; i < lengthOfLists - 1; i++) {
        displays[i] = "none"
      }
      for(let i = 0; i < numberOfNewMiniBoards; i++) {
        titlesOfBoards.push("Column name");
      }
      for(let i = 0; i < numberOfNewMiniBoards; i++) {
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
      document.querySelector(".planner__column-menu").style.display = "inline-block";
      let flexContainer = document.querySelector(".planner-flex");
      flexContainer.scrollTo(0, 0);
      changeDesk(currentBoard[0])
      document.querySelector(".planner").style.marginTop = ""
    }
    colored = false;

    deisplayOfSmallMenu = ""
    document.documentElement.style.paddingRight = "0px";
    document.documentElement.style.overflow = ""; 
    gsap.to(mainDesk.current, {background : mainColor[0]});
    setBoardDetails({boardFullNames: namesOfBoards, showPopup: [], titlesOfMiniBoards: titlesOfBoards, colorsOfBoard: colorsOfFullBoard,colorOfText: colorsOfText, numberOfLists: numberOfColumns, colorOfMainDesk: mainColor, displayOfLists: displays, currentDesk: currentBoard, blockField: boardDetails.blockField})
  }

  function desideToHidePopup(){
    if(textareaNameOfBoard.current.value){
      if(document.getElementById("threeColumn").checked) {
        numberOfNewMiniBoards = 3
        gsap.to(".planner__slider-button-container", {duration: 0, display: ""})
      }else if(document.getElementById("twoColumn").checked) {
        numberOfNewMiniBoards = 2
        gsap.to(".planner__slider-button-container", {duration: 0, display: ""})
      }else {
        numberOfNewMiniBoards = 1;
        gsap.to(".planner__slider-button-container", {duration: 0, display: "none"})
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
        if(i >= startId && i < startId + boardDetails.numberOfLists[nextDesk]) {
          displays[i] = "block";
        } else {
          displays[i] = "none";
        }
      } else {
        if(i >= startId - boardDetails.numberOfLists[currentBoard[0]] - boardDetails.numberOfLists[nextDesk] && i < startId - boardDetails.numberOfLists[currentBoard[0]]) {
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
      if(sideOfSliding === "right") {
        document.querySelector(".planner-bar__container").scrollTo(0, currentBoard[0] * 40);
      } else {
        document.querySelector(".planner-bar__container").scrollTo(0, currentBoard[0] * -40);
      }
      setBoardDetails({boardFullNames: boardDetails.boardFullNames, showPopup: [], titlesOfMiniBoards: boardDetails.titlesOfMiniBoards, colorsOfBoard: boardDetails.colorsOfBoard, colorOfText: boardDetails.colorOfText, numberOfLists: numberOfColumns, colorOfMainDesk: mainColor, displayOfLists: displays, currentDesk: currentBoard, blockField: boardDetails.blockField})
    }, 1000)
  }

  let finishOfSliding = 0;

  function slideColumns(event) {

    let flexContainer = document.querySelector(".planner-flex");
    let whichButton = false;
    if(event.target.closest(".planner__slider--right")) {
      whichButton = true
    }

    if(finishOfSliding >= boardDetails.numberOfLists[boardDetails.currentDesk[0]] - 1 && whichButton ) return;
    if( !whichButton && finishOfSliding <= 0 ) return;
    
    let widthOfContainer = flexContainer.clientWidth;

    let newSpace = document.createElement("div");
    newSpace.className = "planner-fullSpace";
    newSpace.style.height = mainDesk.current.clientHeight + "px";
    newSpace.style.background = boardDetails.colorsOfBoard[boardDetails.currentDesk[0]];
    mainDesk.current.before(newSpace)

    if(whichButton) {
      newSpace.style.right = 0;
      finishOfSliding++
    } else {
      newSpace.style.left = 0;
      finishOfSliding--
    }

    gsap.to(newSpace, {duration : 1, width: "100%"});
    gsap.to(event.target.closest(".planner__slider-button-container"), {duration: 0.3, opacity: 0});

    setTimeout(()=> flexContainer.scrollLeft = widthOfContainer * finishOfSliding, 1000)
    setTimeout(() => newSpace.remove(), 1000);
    gsap.to(".planner__board", {duration: 0, delay: 1, opacity: 0});
    gsap.to(".planner__board", {duration: 0.3, delay: 1.1, opacity: 1});
    gsap.to(event.target.closest(".planner__slider-button-container"), {duration: 0.3, delay: 1.1, opacity: 1});
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
              boardDetails.titlesOfMiniBoards.map ((titleItem, id) => {
                return (
                  <div onMouseUp={containNewTask} key = {id}  style={{display: boardDetails.displayOfLists[id]}} id={"board" + (id + 1)} className="planner__board">
                    <BlockTitle index={id} changeTitle={changeTitleOfList} titleName= {titleItem}></BlockTitle>
                    {
                      boardDetails.blockField[id].tasks.map ((item,index) => {
                        return (<Block realParent={"board" + (id + 1)} id={"board" + (id + 1) + "task" + index} backColor={boardDetails.blockField[id].colors[index]} idOfBlock={id} onKeyPressFunction={handleKeyPress} files={boardDetails.blockField[id].files[index]} descriptionValue={boardDetails.blockField[id].description[index]} hours={boardDetails.blockField[id].hours[index]} minutes={boardDetails.blockField[id].minutes[index]} key = {index} colorFunction={changeColorOfBlock} deleteFunction={deleteBlock} updateFunction={updateTextInBlock} index= {index} taskName= {item}></Block>)
                      })
                    }
                    <button onClick={() => addBlock("Task name", "#fbfeffde", "", "0", "0", "", id)} className="planner__button"><span className="planner__large-element">+</span> Add new task</button>
                </div>
                )
              })
            }
          </div>
          <div className="planner__slider-button-container">
            <button className="planner__slider-button planner__slider--left" onClick={slideColumns}>
              <img className="planner__slider-image" alt="slider button left" src="img/leftarrow.png"/>
            </button>
            <button className="planner__slider-button planner__slider--right" onClick={slideColumns}>
              <img className="planner__slider-image" alt="slider button right" src="img/rightarrow.png"/>
            </button>
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
let containTask = false;
let indexOfTask;
let idOfBoardOfTask;
let taskAfter;
let taskAfterBoard;
plannerContainer.addEventListener('mousedown', function(event) {

  if(document.documentElement.clientWidth <= 843) return

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

    gsap.to(dragElement, {duration: 0, top: 0, left: 0, zIndex: "auto", position: "relative"})

    plannerContainer.removeEventListener('mousemove', onMouseMove);
    dragElement.removeEventListener('mouseup', onMouseUp);

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
        containTask = true;
        taskAfter = nearestTask.id;
        taskAfterBoard = nearestTask.closest(".planner__board").id;
      } else {
        let bottom = droppableBelow.getElementsByClassName("planner__button")[0];
        if(bottom) {
          containTask = true;
          taskAfterBoard = bottom.closest(".planner__board").id;
        }
      }
      gsap.to(droppableBelow, { boxShadow: "none"})
    }
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
  }  
})

