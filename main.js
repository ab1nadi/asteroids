import './style.css'
import Two from 'two.js'
import { GameManager } from './src/gameManager';
import { InputController } from './src/inputController';

var params = {
  height:600,
  width: 600,
};

// init the variables
var elem = document.getElementById("app");
var two = new Two(params).appendTo(elem);
let game = new GameManager(two);
let controller = new InputController(two);


// give the inputcontroller the control functions 
controller.addInput('KeyA', ()=>game.ship.rotateLeft());
controller.addInput('KeyD', ()=>game.ship.rotateRight());
controller.addInput('KeyW', ()=>game.ship.move());
controller.addInput('Space', ()=>game.ship.shoot());
controller.addInput('Enter', ()=>game.doneWaitingOrNextGame());

// bind the update function
two.bind('update', update);
// Finally, start the animation loop
two.play();


// update is called on every frame
function update(frameCount) {
  controller.executeInputs();
  game.update();
}

