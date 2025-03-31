'use strict';
let worldState = 0;
let buttonPressed = -1;
let flowerActivated = -1;


AFRAME.registerComponent('moodflower-bttn', {
    //parameter for component is a string
    schema: { type: 'string' },
    
    init: function(){
        //starts animation for current active flower and saves it
        function activeFlower(buttonIndex) {
            if (worldState === 0) {
                flower[buttonIndex].setAttribute("animation-mixer", "timeScale:0.5; clip: *");
                flowerActivated = buttonIndex;
                worldState = 1;//state toggle
            }
        }

        const CONTEXT_AF = this;
        //console.log("Mood flower button component is registering");
        //array of queries for ease of access
        let flower = [document.querySelector("#flower1"), document.querySelector("#flower2"), document.querySelector("#flower3"), document.querySelector("#flower4")];
        let buttons = [document.querySelector("#bttn1"), document.querySelector("#bttn2"), document.querySelector("#bttn3"), document.querySelector("#bttn4")]
        let buttonColour = [0, 0, 0, 0];
        for (let i = 0; i < buttons.length; i++){
            buttonColour[i] = buttons[i].getAttribute("circles-button");
        }
        this.el.addEventListener("click", () => {
            const moodButton = this.data;
            //turns button string into an easy to access number, could've save this step earlier but html is more ledgible this way
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
            
            //Cooldown State - when flower is in animation we dont want there to be any animation interactions
            if (worldState === 1){
                //Grey's out buttons
                for (let i = 0; i < buttons.length; i++){
                    buttons[i].setAttribute("circles-button", "button_color:rgb(180, 180, 180); button_color_hover:rgb(112, 112, 112);");
                }
                //if the flower is done being animated button is coloured and we move on 
                flower[buttonPressed].addEventListener('animation-finished', () =>{
                    //buttons[buttonPressed].setAttribute("circles-button", "button_color:rgb(42, 167, 73); button_color_hover:rgb(54, 212, 94");;
                    buttons[buttonPressed].setAttribute("circles-button", buttonColour[buttonPressed]);
                    worldState = 2
                })
            }
            if (worldState === 2){
                //once i figure out how to upause a clip then we can work on implementing this
                if (buttonPressed === flowerActivated){
                    console.log("Flower awaiting return...")
                    //flower[buttonPressed].setAttribute("animation-mixer", "timeScale: -0.5 startAt:20 clip: *");
                }

            }
        });
    },

});