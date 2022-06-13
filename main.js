import './style.css'

import Two from 'two.js'
import {Ship} from './ship.js'
import { GameManager } from '../gameManager';


var params = {
  height:500,
  width: 500,
};


var elem = document.getElementById("app");
var two = new Two(params).appendTo(elem);

/*

let z = new Ship(two);


let r = new rock(two, 30,2, {x:250, y:250});
*/


let game = new GameManager(two);


game.spawnRocks();

// key press stuff

// the controller that holds state
const controller = {
  'KeyW': {pressed: false, func: ()=> game.ship.move()},
  'KeyA': {pressed: false, func: ()=> game.ship.rotateLeft()},
  'KeyD': {pressed: false, func: ()=> game.ship.rotateRight()},
  'Space': {pressed: false, func: ()=> game.ship.shoot()}
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
  game.update();
}

