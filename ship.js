import Two from "two.js";
import { Bullet } from "./bullet";


export  class Ship
{
    constructor(two)
    {
        this.two = two;
        this.width = two.width;
        this.height = two.height;


        let ship = two.makePolygon(0,0,10,3);

        let point = two.makeLine(0,0,0,-3);

        point.position.y=ship.position.y-10;

        this.shipFire = two.makePolygon(ship.position.x,ship.position.y+9,5,3);
        this.shipFire.rotation = Math.PI;
        this.shipFire.stroke = "rgb(255,255,255)"

        this.showFire = false;

        // add the ship and the fire to a group
        this.shipObject = two.makeGroup();
        this.shipObject.add(ship, this.shipFire,point);
        this.shipObject.position.x = two.width/2;
        this.shipObject.position.y = two.height/2;
        

        // the vector for velocity
        this.velocity =  new Two.Vector();


        // the force that is applied when the ship moves
        this.forceAcceleration = new Two.Vector(1,0);
        this.forceAcceleration.setLength(0.2);
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

        this.bulletSpeed = 5;

    }


    //adjustAngle
    // adds to the angle
    // doesnt set the angle
    adjustAngle(angle)
    {
        this.shipObject.rotation +=angle;
    }

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
            this.shipFire.stroke = "rgb(255,255,255)";

        
        this.borderCalc();



        // update the bullets
        for(var i = 0; i<this.bullets.length; i++)
            this.bullets[i].update();


    }

    // rotates the ship
    rotateLeft()
    {
        this.shipObject.rotation -= this.rotationStep;
        this.forceAcceleration.rotate(-this.rotationStep);


    }


    // rotates the ship 
    rotateRight()
    {
        this.shipObject.rotation += this.rotationStep;
        this.forceAcceleration.rotate(this.rotationStep);

    }

    // basically applys the moveAcceleration but makes
    // it constant
    move()
    {
        this.velocity.add(this.forceAcceleration);
        this.shipFire.stroke = "rgb(255,0,80)";

    }


    // if its gone off the border
    // lets have it comeout directly opposite
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

    shoot()
    {
        // only shoot a bullet 
        // every 20th frame
        if(this.frameCount%15 ==0)
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