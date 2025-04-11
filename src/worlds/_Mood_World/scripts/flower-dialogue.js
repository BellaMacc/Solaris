'use strict'
AFRAME.registerComponent('flower-dialogue', {
    //parameter for component is a string
    
    schema: {
        dialogueID: {type: 'string', default:'#dialogue'},
    },
    init: function(){
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;

        CONTEXT_AF.dialogueID = data.dialogueID;
        let dialogue = document.querySelector(CONTEXT_AF.dialogueID);
        CONTEXT_AF.el.sceneEl.addEventListener('flower-bttn-pressed', function(){
           
           
            setTimeout(function(){
            dialogue.setAttribute('circles-sound', {state: 'play'});
           }, 2000)
        })
    },
    

});
