'use strict';

AFRAME.registerComponent('avatar-costume-manager', {
    schema: {
        persist:        {type: 'boolean',   default: true}
    },
    init: function(){
        setTimeout('10000');
       
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;
        
        if (!window.newURLSearchParams) {
            window.newURLSearchParams = new URLSearchParams((window.location.search) ? window.location.search : '');
        }
        
        CONTEXT_AF.el.sceneEl.addEventListener('changeCostume', function(event){
            CONTEXT_AF.receiveChangeRequest(event.detail.itemType);
        });
        
    },
    remove:function(){
        
    },
    changeHead: function(itemType){
        const CONTEXT_AF = this;
        const avatar        = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
        const avatarNode    = avatar.querySelector('.user_' + 'head');
        const data = CONTEXT_AF.data;

        

        console.log("Head Changing Received");

        let newHeadSrc = CIRCLES.DEFAULT_GLTF_HEAD;
        let model = 0;
        if (itemType === "frog"){
            newHeadSrc = CIRCLES.SOLARIS_HEADS['frog'];
            avatarNode.setAttribute("circles-color", {color:'white'});

          
           model = 5;

        }
        else if (itemType === "chicken"){
            newHeadSrc = CIRCLES.SOLARIS_HEADS['chicken'];
            avatarNode.setAttribute("circles-color", {color:'white'});

           
            
            model = 6;
        }
        else{
            console.log("Head did not change item type not found");
        }
        avatarNode.setAttribute("gltf-model", newHeadSrc);
        if (window.newURLSearchParams.has('head')){
            window.newURLSearchParams.set('head', model);
            window.newURLSearchParams.set('head'+ '_col',{color:'white'});
        }
        else{
            window.newURLSearchParams.append('head', model);
            window.newURLSearchParams.append('head'+ '_col',{color:'white'});
        }

    },
    changeBody: function(itemType){
        const avatar        = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
        const avatarNode    = avatar.querySelector('.user_' + 'body');
        console.log("Body Changing");

        avatarNode.setAttribute("gltf-model", modelPath);

    },
    receiveChangeRequest: function(info){
        const CONTEXT_AF = this;

        const itemType = info;

        CONTEXT_AF.changeHead(itemType);

    },

});

