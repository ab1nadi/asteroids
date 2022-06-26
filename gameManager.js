import { Ship } from "./ship";
import { Rock } from "./rock";

// rock sizes
let BIG = 50;
let MED = 30;
let SML = 10; 


// states that the game can be in
const START = "start";
const TRANSITION = "transition";
const GAMEOVER = "gameOver";
const WINNER = "winner";
const GAMEDONE = "gamedone";
const PLAY = "play";
const WAIT = "wait";


// stages for the game
let stages = [
    {name: "Stage One", rocks:1, maxSpeed: 2},
    {name: "Stage Two", rocks:10, maxSpeed: 2.5},
    {name: "Stage Three", rocks:15, maxSpeed: 3},
]



// the GameManager class
// handles the updates for the whole
// game and keeps track of stages 
// and wins/losses
export class GameManager 
{
    constructor(two)
    {
        this.two = two;
        this.rocks = [];

        this.background =  two.makeRectangle(two.width/2, two.height/2, two.width, two.height);
        this.background.fill = "rgb(0,0,0)"

        this.ship = new Ship(two);

        this.stage = -1;

        // make the background
      

        this.gameText = two.makeText("Game Over", two.width/2, two.height/2)
        this.gameText.visible = false;
        this.gameText.size = 20;
        this.gameText.fill = "rgb(255,255,255)"

        this.pressEnter = two.makeText("Press Enter to continue", two.width/2, two.height/2+20);
        this.pressEnter.visible = false;
        this.pressEnter.fill = "rgb(255,255,255)"



        this.gameState = START;

        this.frameCount = 0;


        this.updateEvery = 10; // basically this makes sure that 
                               // that we only update every 10 milliseconds
                               // so on computers that are faster the game 
                               // physics run similar

        this.currentTime = 0;   // a running millisecond counter
                                // that is updated in the background
        
        


        

    }


    // updates the game
    // state every frame
    // it also holds the state machine
    // for whatever particular state the game is in
    update()
    {
       
        this.frameCount++;


        // the ship and rocks move
        if(this.gameState == PLAY)
        {
            if(this.currentTime > this.updateEvery)
            {

                this.ship.doNothing = false;
                // check if it is time for a stage change
                if(this.rocks.length == 0)
                {
                    this.gameState = TRANSITION;
                }
                // update the rocks and ship
                // and check for collisions
                for(let i = 0; i<this.rocks.length; i++)
                {
                    this.rocks[i].update();
                }

                this.ship.update();
                this.checkBulletCollision();
                this.checkShipCollision();

                this.currentTime = 0;
            }

        }

        // the starting stage
        else if(this.gameState == START)
        {

            // position the ship 
            this.ship.reposition();

            // set the stage to -1
            this.stage = -1;

            // go to the next gameState
            this.gameState = TRANSITION;
        }

        // update to the next stage
        else if(this.gameState == TRANSITION)
        {
            this.stage++;
            // check if the player won
            if(this.stage == stages.length)
            {
                this.gameState = WINNER;
            }
            // otherwise spawn some rocks
            // with the correct stuff for that stage
            else 
            {
                // spawn the rocks
                this.spawnRocks(stages[this.stage].rocks, stages[this.stage].maxSpeed)
                // set the text to the current stage text
                this.gameText.value = stages[this.stage].name ;
                this.gameText.visible = true;
                this.pressEnter.visible = true;
            }

            // go to the wait 
            this.gameState = WAIT;
            
        }

        // the player won
        else if(this.gameState == WINNER)
        {
            // empty the rocks
            this.emptyRocks();

            this.gameText.value = "You Won!"
            this.gameText.visible = true;
            this.pressEnter.visible = true;
            this.gameState = GAMEDONE;
        }
        // the player lost
        else if(this.gameState == GAMEOVER)
        {

                        // empty the rocks
                        this.emptyRocks();

            this.gameText.value = "You Lost!";
            this.gameText.visible = true;
            this.pressEnter.visible = true;
            this.gameState = GAMEDONE;
        }

        // in these states we just want to wait
        else if(this.gameState == WAIT|| this.gameState == GAMEDONE)
        {
            this.ship.doNothing=true;
        }


        // get the elapsed time from the last
        // frame and add it to the current time
        // for the physics update
        this.currentTime += this.two.timeDelta;

     
    }

    // spawns rocks
    // with a maxSpeed
    // and number
    spawnRocks(number, maxSpeed)
    {
        for(let i = 0; i<number; i++ )
        {
            // random x random y
            let x;
            let y;

            let side = Math.floor(Math.random() * 5);

            // top
            if(side == 1)
            {
                y = 0;
                x  =  Math.floor(Math.random() * this.two.width);
            }
            // right
            else if(side == 2)
            {
                x = this.two.width;
                y = Math.floor(Math.random() * this.two.height);
            }
            // bottom
            else if(side == 3)
            {
                x = Math.floor(Math.random() * this.two.width);
                y = this.two.height;
            }
            // left
            else if(side == 4)
            {
                x = 0;
                y = Math.floor(Math.random() * this.two.height);
            }




            this.rocks.push(new Rock(this.two, BIG, maxSpeed, {x:x,y:y}))
        }
    }


    // checks if any bullets
    // have collided with a rock
    checkBulletCollision()
    {
        // coupled pretty badly but what do you do
        for(let r = 0; r<this.rocks.length; r++)
        {
            for(let i = 0; i<this.ship.bullets.length; i++)
            {
                if(this.rocks[r].checkCollision(this.ship.bullets[i].getPosition()))
                {
                    let roc = this.rocks[r]
                    // splice the rock from the rock array 
                    // and break it apart
                    this.rocks.splice(r,1);
                    this.two.remove(this.ship.bullets[i].bulletObject);


                    // remove the bullet
                    this.two.remove(this.ship.bullets[i].bulletObject);
                    this.ship.bullets.splice(i,1);

                    // break the rock apart into bigger rocks
                    this.breakRockApart(roc);

                    break;
                }
            }
        }
    }


    // checks if the ship has
    // collided with any rocks
    checkShipCollision()
    {
         // coupled pretty badly but what do you do
         for(let r = 0; r<this.rocks.length; r++)
         {
            let v = this.ship.getVertices();

             for(let i = 0; i<v.length; i++)
             {
                 if(this.rocks[r].checkCollision(v[i]))
                 {
                   
                    this.gameState = GAMEOVER;

                     break;
                 }
             }
         }

    }


    // break a rock into smaller rocks
    breakRockApart(rock)
    {

                    // the rock will just disapear if it is small
                    this.two.remove(rock.rockObject); // remove the rock from the scene

            if(rock.radius == BIG)
            {
                // create two medium rocks with the same position and 

                this.rocks.push(new Rock(this.two, MED, stages[this.stage].maxSpeed, rock.getPosition()))
                this.rocks.push(new Rock(this.two, MED,stages[this.stage].maxSpeed, rock.getPosition()));
                this.rocks.push(new Rock(this.two, MED,stages[this.stage].maxSpeed, rock.getPosition()));

            }
            else if(rock.radius == MED)
            {
                // create two medium rocks with the same position and 
                this.rocks.push(new Rock(this.two, SML,stages[this.stage].maxSpeed, rock.getPosition()))
                this.rocks.push(new Rock(this.two, SML,stages[this.stage].maxSpeed, rock.getPosition()));
            }



    }


    // removes all rocks from the rock array
    emptyRocks()
    {
        for(let i = 0; i<this.rocks.length ;i++)
        {
            this.two.remove(this.rocks[i].rockObject);
        }
        
        

        this.rocks = [];
    }

    // either starts the next
    // stage or starts the next game
    doneWaitingOrNextGame()
    {
        if(this.frameCount %5==0)
        {
            if(this.gameState == WAIT)
            {
                this.gameText.visible = false;
                this.pressEnter.visible = false;
                this.gameState=PLAY;
            }
            else if(this.gameState == GAMEDONE)
            {
                this.gameText.visible = false;
                this.pressEnter.visible = false;
                this.gameState = START;
            }
     }
    }

}