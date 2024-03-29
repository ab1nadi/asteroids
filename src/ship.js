import Two from "two.js";
import { Bullet } from "./bullet";

// the ship class
// does all the stuff
// that a two js ship should do
// updating the position and checking collissions
export  class Ship
{
    constructor(two)
    {
        // gives us the width
        // and the actual two object
        // so that the ship has access to this stuff
        this.two = two;
        this.width = two.width;
        this.height = two.height;

        // the ship
        this.shipP = two.makePolygon(0,0,10,3);
        this.shipP ._fill = "rgb(0,0,0)";
        this.shipP .stroke = "rgb(255,255,255)"
        


        let point = two.makeLine(0,0,0,-3);
        point.stroke = "rgb(255,255,255)"
        point.position.y=this.shipP .position.y-10;


        // the fire behind the ship
        this.shipFire = two.makePolygon(this.shipP.position.x,this.shipP .position.y+9,5,3);
        this.shipFire.rotation = Math.PI;
        this.shipFire.stroke = "rgb(0,0,0)"
        this.shipFire.fill= "rgb(0,0,0)"



        this.showFire = false;

        // add the ship and the fire to a group
        this.shipObject = two.makeGroup();
        this.shipObject.add(this.shipP , this.shipFire,point);
        this.shipObject.position.x = two.width/2;
        this.shipObject.position.y = two.height/2-15;
        

        // the vector for velocity
        this.velocity =  new Two.Vector();


        // the force that is applied when the ship moves
        this.forceAcceleration = new Two.Vector(1,0);
        this.forceAcceleration.setLength(0.3);
        this.forceAcceleration.rotate(-Math.PI/2);

        // tells it weather or not to apply the force
        this.forceApplied = false;

        // friction is always applied no matter what 
        // in the opposite direction of velocity so that
        // it eventually slows down to 0
        this.frictionForceMagnitude = 0.07;


        // the rotation that the player can do
        this.rotationStep = 0.08;


        // the max speed
        this.maxVelocity = 6;

        this.frameCount = 0;

        this.bullets = [];

        this.bulletSpeed = 8;

        this.doNothing = false;
    }


    // adjustAngle
    // adds to the angle
    // doesn't set the angle
    adjustAngle(angle)
    {
        this.shipObject.rotation +=angle;
    }


    // repostion
    // resets the ship
    // to the center if you lose
    reposition()
    {
        this.shipObject.position.x = this.two.width/2;
        this.shipObject.position.y = this.two.height/2-15;
        this.velocity.setLength(0);
        this.forceAcceleration = new Two.Vector(1,0);
        this.forceAcceleration.setLength(0.2);
        this.forceAcceleration.rotate(-Math.PI/2);
        this.shipObject.rotation = 0;
        this.shipFire.stroke = "rgb(0,0,0)"
        this.shipFire.fill= "rgb(0,0,0)"

        for(let i = 0; i<this.bullets.length; i++)
        {
            this.two.remove(this.bullets[i].bulletObject);
        }

        this.bullets=[];
    }


    // updates the ships
    // position 
    // and other stuff
    update()
    {
        // pretty much no matter what we want
        // the objects velocity added to the position
        this.shipObject.position.add(this.velocity);

        
        // We don't want it going faster then the max
        // velocity even with the force
        if(this.velocity.length() > this.maxVelocity)
        this.velocity.setLength(this.maxVelocity)
      

        // account for the friction
        let friction = this.velocity.clone();
        friction.setLength(this.frictionForceMagnitude);
        this.velocity.subtract(friction);
        

        this.frameCount++;

        // every 8 frames lets turn the fire off and on 
        // for flickering and so it turns off
        if(this.frameCount%8 == 0)
            {
                this.shipFire.stroke = "rgb(0,0,0)";
                this.shipFire.fill = "rgb(0,0,0)";
                
        }

        
        this.borderCalc();



        // update the bullets
        for(var i = 0; i<this.bullets.length; i++)
            this.bullets[i].update();



    }


    // rotates the ship left
    rotateLeft()
    {
        if(!this.doNothing)
        {
            this.shipObject.rotation -= this.rotationStep;
            this.forceAcceleration.rotate(-this.rotationStep);
        }
    }


    // rotates the ship right
    rotateRight()
    {
        if(!this.doNothing)
        {
            this.shipObject.rotation += this.rotationStep;
            this.forceAcceleration.rotate(this.rotationStep);
        }
    }

    // basically applys the moveAcceleration but makes
    // it constant
    move()
    {
        if(!this.doNothing)
        {
        this.velocity.add(this.forceAcceleration);
        this.shipFire.stroke = "rgb(255,0,80)";
        this.shipFire.fill = "rgb(255,0,80)";
        }
    }


    // borderCalc
    // essentially this
    // adjusts the ships position to 
    // the opposite side of the screen
    // when it crosses the border
    borderCalc()
    {
        let p1 = this.shipObject.position.clone();
        let p2 = this.velocity.clone();

        p2.setLength(10);  
        p2.add(p1);

        let slope = (p1.y-p2.y)/(p1.x-p2.x);

        let intercept = p1.y-(slope*p1.x);


        let top = (-5-intercept)/slope;

        let bottom = (this.height+5-intercept)/slope;


        let left = slope*(-5)+intercept;

        let right = slope*(this.width+5)+intercept;


        if(top > this.width || top <0)
            top = null;
        if(bottom > this.width || bottom < 0)
            bottom = null;
        if(left > this.height || left < 0)
            left = null;
        if(right > this.height || right < 0)
            right = null;

        if(p1.x > this.width+5)
        {
            if(top)
            {
                this.shipObject.position.x = top;
                this.shipObject.positiony = -5;
            }
            else if(left)
            {
                this.shipObject.position.x = -5;
                this.shipObject.position.y = left;
            }
            else if(bottom)
            {
                this.shipObject.position.x = bottom;
                this.shipObject.position.y = this.height+5;
            }
        } 
        else if(p1.x < -5)
        {
            if(top)
            {
                this.shipObject.position.x = top;
                this.shipObject.position.y = -5;
            }
            else if(right)
            {
                this.shipObject.position.x = this.width+5;
                this.shipObject.position.y = right;
            }
            else if(bottom)
            {
                this.shipObject.position.x = bottom;
                this.shipObject.position.y = this.height+5;
            }
        }
        else if(p1.y > this.height+5)
        {
            if(left)
            {
                this.shipObject.position.x = -5;
                this.shipObject.position.y = left;
            }
            else if(top)
            {
                this.shipObject.position.x = top;
                this.shipObject.position.y = -5;
            }
            else if(right)
            {
                this.shipObject.position.x = this.width+5;
                this.shipObject.position.y = right;
            }
        }
        else if(p1.y <-5)
        {
            if(left)
            {
                this.shipObject.position.x = -5;
                this.shipObject.position.y = left;
            }
            else if(bottom)
            {
                this.shipObject.position.x = bottom;
                this.shipObject.position.y = this.width+5;
            }
            else if(right)
            {
                this.shipObject.position.x = this.width+5;
                this.shipObject.position.y = right;
            }
        }

    }

    // shoot a bullet
    shoot()
    {
        if(!this.doNothing)
        {
        // only shoot a bullet 
        // every 20th frame
        if(this.frameCount%20 ==0)
        {
            // build the bullet velocity vector
            let bulletVelocity = this.forceAcceleration.clone();
            bulletVelocity.setLength(this.bulletSpeed);

            bulletVelocity.add(this.velocity);

            // build the bullet position vector
            let bulletPosition = this.shipObject.position.clone();
            bulletPosition.add(bulletVelocity);

            // spawn the bullet
            let b = new Bullet(this.two,bulletPosition,bulletVelocity, this.bullets)
            this.bullets.push(b);
        }
    }

    }

    // returns the vertices
    // for calculation 
    // of collisions with rocks
    getVertices()
    {
        let returned = [];
       for(let i = 0; i < this.shipP.vertices.length; i++)
       {
        returned.push({x:this.shipP.vertices[i]._x+this.shipObject.position.x, y: this.shipP.vertices[i]._y+this.shipObject.position.y})
       }


       return returned;
    }
    
}