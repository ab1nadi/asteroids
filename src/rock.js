import Two from "two.js";

// the rock class
// does everything that 
// a rock should do in a two.js
// canvas, loading, updating, and other stuff
export  class Rock
{
    constructor(two, radius, velocity, position)
    {

        this.width = two.width;
        this.height = two.height;

        this.radius = radius;


        this.rockObject = two.makePolygon(position.x, position.y, radius, 9);

        this.rockObject.fill = "rgb(0,0,0)"
        this.rockObject.stroke = "rgb(255,255,255)"

        this.velocity = new Two.Vector(0,velocity);


        let random = Math.random() * 2 * Math.PI;

        

        this.velocity.rotate(random)

        this.rotationStep = 0.001;


        this.spinStep = 0.01;

        this.frameCount = 0;

    }


    // the update function 
    // for the rock
    // this is where the animations happen
    update()
    {
        this.rockObject.position.add(this.velocity)

        this.borderCalc();


        this.frameCount++;

        if(this.frameCount%10)
            this.velocity.rotate(this.rotationStep);

        this.rockObject.rotation +=this.spinStep;

    }

    // returns the position of 
    // the rock
    getPosition()
    {
        return {x:this.rockObject.position.x, y:this.rockObject.position.y};
    }


    // check collision
    // checks if a point
    // intersects this rock
    checkCollision(point)
    {
        let distance = Two.Vector.distanceBetween(point, this.rockObject.position);

        if(distance <= this.radius)
            return true;
        else 
            return false;
    }


    // borderCal
    // essentially if a rock crosses the border
    // this function throws it to the other side of the
    // border so that it doesn't just disappear into the abyss
    borderCalc()
    {
        let p1 = this.rockObject.position.clone();
        let p2 = this.velocity.clone();

        p2.setLength(10);  
        p2.add(p1);

        let dist = this.radius;

        let slope = (p1.y-p2.y)/(p1.x-p2.x);

        let intercept = p1.y-(slope*p1.x);


        let top = (-dist-intercept)/slope;

        let bottom = (this.height+dist-intercept)/slope;


        let left = slope*(-dist)+intercept;

        let right = slope*(this.width+dist)+intercept;


        if(top > this.width || top <0)
            top = null;
        if(bottom > this.width || bottom < 0)
            bottom = null;
        if(left > this.height || left < 0)
            left = null;
        if(right > this.height || right < 0)
            right = null;


        if(p1.x > this.width+dist)
        {

            if(top)
            {
                this.rockObject.position.x = top;
                this.rockObject.positiony = -dist;
            }
            else if(left)
            {
                this.rockObject.position.x = -dist;
                this.rockObject.position.y = left;
            }
            else if(bottom)
            {
                this.rockObject.position.x = bottom;
                this.rockObject.position.y = this.height+dist;
            }
        } 
        else if(p1.x < -dist)
        {
            

            if(top)
            {
                this.rockObject.position.x = top;
                this.rockObject.position.y = -dist;
            }
            else if(right)
            {
                this.rockObject.position.x = this.width+dist;
                this.rockObject.position.y = right;
            }
            else if(bottom)
            {
                this.rockObject.position.x = bottom;
                this.rockObject.position.y = this.height+dist;
            }
        }
        else if(p1.y > this.height+dist)
        {
         

            if(left)
            {
                this.rockObject.position.x = -dist;
                this.rockObject.position.y = left;
            }
            else if(top)
            {
                this.rockObject.position.x = top;
                this.rockObject.position.y = -dist;
            }
            else if(right)
            {
                this.rockObject.position.x = this.width+dist;
                this.rockObject.position.y = right;
            }
        }
        else if(p1.y <-dist)
        {
            

            if(left)
            {
                this.rockObject.position.x = -dist;
                this.rockObject.position.y = left;
            }
            else if(bottom)
            {
                this.rockObject.position.x = bottom;
                this.rockObject.position.y = this.width+dist;
            }
            else if(right)
            {
                this.rockObject.position.x = this.width+dist;
                this.rockObject.position.y = right;
            }
            
    }}
}