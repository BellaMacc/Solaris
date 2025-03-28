'use strict';

AFRAME.registerComponent('moodflower-bttn', {
    init: function(){
       
        const CONTEXT_AF = this;
        //const moodButton = this.data;
        //console.log(moodButton);
        console.log("Mood flower button component is registering");

        this.el.addEventListener("click", () => {
            console.log("mood flower has been clicked")
        });
    },

});