AFRAME.registerComponent('solaris-flower-manager', {
    //parameter for component is a string
    
    
    init: function(){
        const CONTEXT_AF = this;
        CONTEXT_AF.el.setAttribute('gltf-model', CIRCLES.SOLARIS_FLOWERS['blue']);
        CONTEXT_AF.el.setAttribute("animation-mixer", " clip: " + CIRCLES.SOLARIS_FLOWER_ANIM['seed_idle']);

       
        CONTEXT_AF.el.sceneEl.addEventListener('flower-bttn-pressed', function(event){
            details = {selection: event.detail.selection, context: CONTEXT_AF}
            CONTEXT_AF.changeFlower(details);
        });
    },
    changeFlower: function(details){
        //if an e is passed 
        console.log( details.context)
        const CONTEXT_AF =  (details.context) ;
        const selection  = details.selection;
        CONTEXT_AF.el.setAttribute("animation-mixer", " clip: " + CIRCLES.SOLARIS_FLOWER_ANIM['seed_stop']);
        if (selection == 'blue'){
            CONTEXT_AF.el.setAttribute('gltf-model', CIRCLES.SOLARIS_FLOWERS['blue']);
            
        }
        else if (selection == 'red'){
            CONTEXT_AF.el.setAttribute('gltf-model', CIRCLES.SOLARIS_FLOWERS['red']);
        }
        else if (selection == 'yellow'){
            CONTEXT_AF.el.setAttribute('gltf-model', CIRCLES.SOLARIS_FLOWERS['yellow']);
        }
        else{
            CONTEXT_AF.el.setAttribute('gltf-model', CIRCLES.SOLARIS_FLOWERS['white']);
        }
        CONTEXT_AF.el.setAttribute("animation-mixer", " clip: " + CIRCLES.SOLARIS_FLOWER_ANIM['flower_play']);
        setTimeout(function(){
            console.log('going idle')
            CONTEXT_AF.el.setAttribute("animation-mixer",  " clip: " + CIRCLES.SOLARIS_FLOWER_ANIM['flower_idle']);
        }, 5000)
    }

});