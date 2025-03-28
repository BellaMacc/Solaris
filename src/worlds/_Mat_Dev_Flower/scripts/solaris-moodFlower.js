
AFRAME.registerComponent("onClick-flowerButton", {
    init: function (){
        //const CONTEXT_AF = this;
        //const moodButton = this.data;
        //console.log(moodButton);
        console.log("HEY");

        this.el.addEventListener("click", () => {
            console.log("HELLOOOOO")
        });
    }
});