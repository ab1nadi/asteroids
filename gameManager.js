import { Ship } from "./ship";
import { Rock } from "./rock";
let BIG = 30;
let MED = 20;
let SML = 10; 
export class GameManager 
{
    constructor(two)
    {
        this.two = two;
        this.rocks = [];

        this.ship = new Ship(two);


        this.rockSpeed = 2;

        this.rockCount = 5;


        this.gameOverText = two.makeText("Game Over", two.width/2, two.height/2)
        this.gameOverText.visible = false;

        this.gameOver = false;
    }

    update()
    {
       


        if(!this.gameOver)
        {

            for(let i = 0; i<this.rocks.length; i++)
            {
                this.rocks[i].update();
            }
        this.ship.update();


        this.checkBulletCollision();

        this.checkShipCollision();
        }

        

     
    }

    spawnRocks()
    {
        for(let i = 0; i<this.rockCount; i++ )
        {
            // random x random y
            let x =  Math.floor(Math.random() * this.two.width);
            let y = Math.floor(Math.random() * this.two.height);

            this.rocks.push(new Rock(this.two, BIG, this.rockSpeed, {x:x,y:y}))
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
                   
                    this.gameOver = true;
                    this.gameOverText.visible = true;

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

                this.rocks.push(new Rock(this.two, MED, this.rockSpeed, rock.getPosition()))
                this.rocks.push(new Rock(this.two, MED,this.rockSpeed, rock.getPosition()));

            }
            else if(rock.radius == MED)
            {
                // create two medium rocks with the same position and 
                this.rocks.push(new Rock(this.two, SML,this.rockSpeed, rock.getPosition()))
                this.rocks.push(new Rock(this.two, SML,this.rockSpeed, rock.getPosition()));
            }



    }
}