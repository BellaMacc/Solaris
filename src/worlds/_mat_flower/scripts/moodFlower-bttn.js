'use strict';
let worldState = 0;
let buttonPressed = -1;
let flowerActivated = -1;

AFRAME.registerComponent('moodflower-bttn', {
    //parameter for component is a string
    schema: { type: 'string' },
    
    init: function(){
        //starts animation for current active flower and saves it
        function activeFlower(buttonNumber) {
            if (worldState === 0) {
                fakeFlower.setAttribute("visible", "false");
                flower[buttonNumber].setAttribute("animation-mixer", " clip: *; timeScale:0.5; loop: once; clampWhenFinished: true;");
                flower[buttonNumber].setAttribute("visible", "true");

                flowerActivated = buttonNumber;
                worldState = 1;//state toggle
            }
        }
        
        const CONTEXT_AF = this;
        //console.log("Mood flower button component is registering");
        //array of queries for ease of access
        let fakeFlower      = document.querySelector("#flower0"); 
        let flower          = [document.querySelector("#flower1"), document.querySelector("#flower2"), document.querySelector("#flower3"), document.querySelector("#flower4")];
        let buttons         = [document.querySelector("#bttn1"), document.querySelector("#bttn2"), document.querySelector("#bttn3"), document.querySelector("#bttn4")];
        //collects all the button ID's
        let buttonColour    = [0, 0, 0, 0];
        for (let i = 0; i < buttons.length; i++){
            buttonColour[i] = buttons[i].getAttribute("circles-button");
        }
        this.el.addEventListener("click", () => {
            const moodButton = this.data;
            //turns button string into an easy to access number, could've saved this step earlier by using a different schema but html is more ledgible this way
            switch (moodButton) {
                //SAD = BLUE
                case "sadness":
                    buttonPressed = 0;
                    activeFlower(buttonPressed)
                    break;
                //ANGRY = RED
                case "anger":
                    buttonPressed = 1;
                    activeFlower(buttonPressed)
                    break;
                //HAPPY = YELLOW
                case "happiness":
                    buttonPressed = 2;
                    activeFlower(buttonPressed)
                    break;
                //FEAR = PURPLE
                case "fearful":
                    buttonPressed = 3;
                    activeFlower(buttonPressed)
                    break;
                default:
                    console.log("ERR: No mood available");
            }
            console.log("Button pressed:" + buttonPressed);
            console.log("Current active flower:" + flowerActivated);
            
            //Cooldown State - when flower is in animation we dont want there to be any animation interactions
            if (worldState === 1){
                //Grey's out buttons
                for (let i = 0; i < buttons.length; i++){
                    buttons[i].setAttribute("circles-button", "button_color:rgb(180, 180, 180); button_color_hover:rgb(112, 112, 112);");
                }
                //if the flower is done being animated button is coloured and we move on 
                flower[buttonPressed].addEventListener('animation-finished', () =>{
                    //buttons[buttonPressed].setAttribute("circles-button", "button_color:rgb(42, 167, 73); button_color_hover:rgb(54, 212, 94");
                    buttons[buttonPressed].setAttribute("circles-button", buttonColour[buttonPressed]);
                    
                    flower[buttonPressed].removeAttribute("animation-mixer");
                    
                    worldState = 2
                });
            }
            
            //would've made this stuff work but Bella told me not to 
            //if (worldState === 2){
                //once i figure out how to upause a clip then we can work on implementing this
                //flower[buttonPressed].setAttribute("animation-mixer", {clip: "*", timeScale:-0.5, loop: "repeat", repetitions: '1'});
                //if (buttonPressed === flowerActivated){
                //    console.log("Flower awaiting return...")
                    //flower[buttonPressed].setAttribute("animation-mixer", {clip: " *"});
                    

                    // flower[buttonPressed].addEventListener('animation-finished', () =>{
                    //     worldState = 3;
                    // });
                //}
            //}
            
            // if (worldState === 3){
            //         console.log("animation over");
            //         flower[buttonPressed].setAttribute("visible", "false");
            //         worldState = 0;
            //     }
        });
    },
});