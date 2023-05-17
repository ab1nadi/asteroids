// The InputController class
// handles keyboard input
// and takes into account time
// so that it runs similar on all machines (hopefully)
export class InputController
{
    constructor(two)
    {
        this.inputs = {};

        this.two = two;

        // setup the eventlistneres
        document.addEventListener("keydown", (e) => {
            if(this.inputs[e.code]){
                this.inputs[e.code].pressed = true
            }
          })
          document.addEventListener("keyup", (e) => {
            if(this.inputs[e.code]){
                this.inputs[e.code].pressed = false
            }
          })


          this.currentTime = 0;
          this.updateEvery = 8;

    }

    addInput(value, func)
    {
        this.inputs[value]={pressed:false, func: ()=>func()}
    }

    // runs the function
    // associated with each input
    // if it is pressed
    executeInputs()
    {
        this.currentTime += this.two.timeDelta;

        if(this.currentTime > this.updateEvery)
        {
            Object.keys(this.inputs).forEach(key=> {
                this.inputs[key].pressed && this.inputs[key].func()
            })
            this.currentTime = 0;
        }
    }


}