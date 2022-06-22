import { Ship } from "./ship";
import { Rock } from "./rock";
let BIG = 30;
let MED = 20;
let SML = 10; 

const START = "start";
const TRANSITION = "transition";
const GAMEOVER = "gameOver";
const WINNER = "winner";
const GAMEDONE = "gamedone";
const PLAY = "play";
const WAIT = "wait";

let stages = [
    {name: "Stage One", rocks:5, maxSpeed: 2},
    {name: "Stage Two", rocks:6, maxSpeed: 2.5},
    {name: "Stage Three", rocks:10, maxSpeed: 3},
]


export class GameManager 
{
    constructor(two)
    {
        this.two = two;
        this.rocks = [];

        this.ship = new Ship(two);

        this.stage = -1;


        this.gameText = two.makeText("Game Over", two.width/2, two.height/2)
        this.gameText.visible = false;
        this.gameText.size = 20;

        this.pressEnter = two.makeText("Press Enter to continue", two.width/2, two.height/2+20);
        this.pressEnter.visible = false;


        this.gameState = START;

        this.frameCount = 0;

    }

    update()
    {
       
        this.frameCount++;

        if(this.gameState == PLAY)
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
        }
        else if(this.gameState == START)
        {

            // position the ship 
            this.ship.reposition();

            // set the stage to -1
            this.stage = -1;

            // go to the next gameState
            this.gameState = TRANSITION;
        }
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
        else if(this.gameState == WINNER)
        {
            // empty the rocks
            this.emptyRocks();

            this.gameText.value = "You Won!"
            this.gameText.visible = true;
            this.pressEnter.visible = true;
            this.gameState = GAMEDONE;
        }
        else if(this.gameState == GAMEOVER)
        {

                        // empty the rocks
                        this.emptyRocks();

            this.gameText.value = "You Lost!";
            this.gameText.visible = true;
            this.pressEnter.visible = true;
            this.gameState = GAMEDONE;
        }
        else if(this.gameState == WAIT|| this.gameState == GAMEDONE)
        {
            this.ship.doNothing=true;
        }

        

     
    }

    spawnRocks(number, maxSpeed)
    {
        for(let i = 0; i<number; i++ )
        {
            // random x random y
            let x =  Math.floor(Math.random() * this.two.width);
            let y = Math.floor(Math.random() * this.two.height);

            this.rocks.push(new Rock(this.two, BIG, maxSpeed, {x:x,y:y}))
        }
    }

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

    breakRockApart(rock)
    {

                    // the rock will just disapear if it is small
                    this.two.remove(rock.rockObject); // remove the rock from the scene

            if(rock.radius == BIG)
            {
                // create two medium rocks with the same position and 

                this.rocks.push(new Rock(this.two, MED, stages[this.stage].maxSpeed, rock.getPosition()))
                this.rocks.push(new Rock(this.two, MED,stages[this.stage].maxSpeed, rock.getPosition()));

            }
            else if(rock.radius == MED)
            {
                // create two medium rocks with the same position and 
                this.rocks.push(new Rock(this.two, SML,stages[this.stage].maxSpeed, rock.getPosition()))
                this.rocks.push(new Rock(this.two, SML,stages[this.stage].maxSpeed, rock.getPosition()));
            }



    }

    emptyRocks()
    {
        for(let i = 0; i<this.rocks.length ;i++)
        {
            this.two.remove(this.rocks[i].rockObject);
        }
        
        

        this.rocks = [];
    }


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

        console.log("got called");
    }

}