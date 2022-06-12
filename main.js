import './style.css'

import Two from 'two.js'
import {Ship} from './ship.js'
import { rock } from './rock';


var params = {
  height:500,
  width: 500,
};


var elem = document.getElementById("app");
var two = new Two(params).appendTo(elem);



let z = new Ship(two);


let r = new rock(two, 30,2);



// key press stuff

// the controller that holds state
const controller = {
  'KeyW': {pressed: false, func: ()=> z.move()},
  'KeyA': {pressed: false, func: ()=> z.rotateLeft()},
  'KeyD': {pressed: false, func: ()=> z.rotateRight()},
  'Space': {pressed: false, func: ()=> z.shoot()}
}

// set state for the controler with event listeners
document.addEventListener("keydown", (e) => {
  if(controller[e.code]){
    controller[e.code].pressed = true
  }
})
document.addEventListener("keyup", (e) => {
  if(controller[e.code]){
    controller[e.code].pressed = false
  }
})

// executes the moves
// for the controller state
const executeMoves = () => {
  Object.keys(controller).forEach(key=> {
    controller[key].pressed && controller[key].func()
  })
}





two.bind('update', update);
// Finally, start the animation loop
two.play();

function update(frameCount) {
  executeMoves();
  z.update();

  r.update();
}

