'use strict';
//NOTE!!: There needs to be a material on the model before we "extend" it with "highlight". A gltf likley has one, but make sure if manually defining that the "material" attribute is listed before this component


AFRAME.registerComponent('onclick-sproot', {
    schema: {
      isPlaying:  {type:'boolean', default:false},
      modelID: {type: 'string', default:'#sproot'},
      dialogueID: {type: 'string', default:'#dialogue'},
     
     
    },
    init: function() {
      const CONTEXT_AF = this;
      const data = CONTEXT_AF.data;

      CONTEXT_AF.modelID = data.modelID;
      CONTEXT_AF.dialogueID = data.dialogueID;

      this.el.addEventListener('click', function(e){
        console.log("I am clicked!");
        const CONTEXT_AF = (e) ? e.srcElement.components['onclick-sproot'] : this;
        
        console.log(CONTEXT_AF.modelID);
        console.log(CONTEXT_AF.dialogueID);
        let sproot = document.querySelector(CONTEXT_AF.modelID);
        console.log(sproot);
        let dialogue = document.querySelector(CONTEXT_AF.dialogueID);
        console.log(dialogue);
        sproot.setAttribute("animation-mixer", "clip: Sproot_Waving; loop:once");
        dialogue.setAttribute('circles-sound', {state: 'play'});
     
        setTimeout(function(){
          sproot.setAttribute("animation-mixer", "clip: Sproot_Idle; loop:repeat");
        }, 8000)
        
        
        
      });
      CONTEXT_AF.el.addEventListener('animation-finished', function(){
        sproot.setAttribute("animation-mixer", "clip: Sproot_Idle; loop:repeat");
       
      });
      
        
      },

    

  

      //make sure this is interactive
    
    
  });