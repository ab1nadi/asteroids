import Two from "two.js";
export  class rock
{
    constructor(two, radius, velocity)
    {

        this.width = two.width;
        this.height = two.height;


        this.rockObject = two.makePolygon(this.width/2, this.height/2, radius, 9);

        this.velocity = new Two.Vector(0,velocity);


        let random = Math.random() * 2 * Math.PI;

        

        this.velocity.rotate(random)

        this.rotationStep = 0.001;


        this.spinStep = 0.01;

        this.frameCount = 0;

    }



    update()
    {
        this.rockObject.position.add(this.velocity)

        this.borderCalc();


        this.frameCount++;

        if(this.frameCount%10)
            this.velocity.rotate(this.rotationStep);



        this.rockObject.rotation +=this.spinStep;
    }



    // check collision
    // checks if a point
    // intersects this rock
    checkCollision(point)
    {
        let distnace = Two.Vector.distanceBetween(point, this.rockObject.position);

        if(distance <= radius)
            return true;
        else 
            return false;
    }



     // if its gone off the border
    // lets have it comeout directly opposite
    borderCalc()
    {
        let p1 = this.rockObject.position.clone();
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
                this.rockObject.position.x = top;
                this.rockObject.positiony = -5;
            }
            else if(left)
            {
                this.rockObject.position.x = -5;
                this.rockObject.position.y = left;
            }
            else if(bottom)
            {
                this.rockObject.position.x = bottom;
                this.rockObject.position.y = this.height+5;
            }
        } 
        else if(p1.x < -5)
        {
            

            if(top)
            {
                this.rockObject.position.x = top;
                this.rockObject.position.y = -5;
            }
            else if(right)
            {
                this.rockObject.position.x = this.width+5;
                this.rockObject.position.y = right;
            }
            else if(bottom)
            {
                this.rockObject.position.x = bottom;
                this.rockObject.position.y = this.height+5;
            }
        }
        else if(p1.y > this.height+5)
        {
         

            if(left)
            {
                this.rockObject.position.x = -5;
                this.rockObject.position.y = left;
            }
            else if(top)
            {
                this.rockObject.position.x = top;
                this.rockObject.position.y = -5;
            }
            else if(right)
            {
                this.rockObject.position.x = this.width+5;
                this.rockObject.position.y = right;
            }
        }
        else if(p1.y <-5)
        {
            

            if(left)
            {
                this.rockObject.position.x = -5;
                this.rockObject.position.y = left;
            }
            else if(bottom)
            {
                this.rockObject.position.x = bottom;
                this.rockObject.position.y = this.width+5;
            }
            else if(right)
            {
                this.rockObject.position.x = this.width+5;
                this.rockObject.position.y = right;
            }
            
        }}
}