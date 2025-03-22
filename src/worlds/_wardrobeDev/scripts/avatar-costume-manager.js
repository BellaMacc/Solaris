'use strict';

AFRAME.registerComponent('avatar-costume-manager', {

    init: function(){
        setTimeout('10000');
       
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;


        

        CONTEXT_AF.el.sceneEl.addEventListener('changeCostume', function(event){
            CONTEXT_AF.receiveChangeRequest(event.detail.itemType);
        });
    },
    remove:function(){
        
    },
    changeHead: function(itemType){
        const avatar        = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
        const avatarNode    = avatar.querySelector('.user_' + 'head');
        console.log("Head Changing Received");

        if (itemType === "frog"){
            avatarNode.setAttribute("gltf-model", '#frog_model');
        }
        else if (itemType === "chicken"){
            avatarNode.setAttribute("gltf-model", '#chicken_model');
        }
        else{
            console.log("Head did not change item type not found");
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

