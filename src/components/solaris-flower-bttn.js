AFRAME.registerComponent('solaris-flower-bttn', {
    //parameter for component is a string
    
    schema: {
        flowerColor:   {type: "string", default:'white', oneOf:['blue', 'red', 'yellow', 'white']}
    },
    init: function(){
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;
        //keep track of what color is selected
        CONTEXT_AF.thisColor = data.flowerColor;
        CONTEXT_AF.isInteractable = true;

        const onClicked = function() {
            if (CONTEXT_AF.isInteractable){
                CONTEXT_AF.el.emit('flower-bttn-pressed', {selection: CONTEXT_AF.thisColor}, true);
            }
           
        };
        //start listenting for click
        CONTEXT_AF.el.addEventListener('click',onClicked)
        CONTEXT_AF.el.sceneEl.addEventListener('flower-bttn-pressed', function(){
            CONTEXT_AF.isInteractable = false;
        })
       
    },
    

});
