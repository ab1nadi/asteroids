import Two from "two.js";

export class Bullet{

    constructor(two, position, velocity, holder)
    {
        this.two = two;
        this.width = two.width;
        this.height = two.height;
        this.bulletObject = two.makeCircle(position.x,position.y, 2, 10);
        this.velocity = velocity;

        this.holder = holder;

    }


    // updates the position
    // of the bullet
    update()
    {
        this.bulletObject.position.add(this.velocity);

        this.borderCalc();
    }

    // gets the position
    // so that it can be used
    // with collision detection
    getPosition()
    {
        return this.bulletObject.position;
    }


    // checks if the bullet has
    // gone pst the border
    borderCalc()
    {
        let p = this.bulletObject.position;
        if(p.x > this.width || p.x <0 || p.y > this.height || p.y <0 )
           {
                for(let i = 0; i<this.holder.length; i++)
                {
                    if(this.holder[i] == this)
                        {
                            this.two.remove(this.bulletObject)
                            this.holder.splice(i,1);
                            break;
                        }
                        
                }
           }
    }
}