'use strict';
//what we need here is a socket.io shout function that happens whenever a player joins,
// in this instance every player shouts their head information
//following the mass shouting, we listen for all of the shouts

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
            console.log("head Change here");
            CONTEXT_AF.receiveChangeRequest(event.detail.itemType);
        });
        
    },
    remove:function(){
        
    },
    changeHead: function(itemType){
        
        const CONTEXT_AF = this;
        const avatar        = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);//gets this player's components 
        const avatarNode    = avatar.querySelector('.user_' + 'head');//using "component search" we select the head component & everything underneath it
        const avatarFace    = avatarNode.querySelector('.user_' + 'face_express');//narrows component down to face (smiley image layer)
        
        const data = CONTEXT_AF.data;
        
        console.log(CIRCLES.SOLARIS_HEADS['frog']);//array of all of our heads
        console.log(avatarNode);
        console.log(avatarFace);


        console.log("Head Changing Received");

        //sets new head to default
        let newHeadSrc = CIRCLES.DEFAULT_GLTF_HEAD;
        let model = 0;
        if (itemType === "frog"){//if item in the crypod is frog
            newHeadSrc = CIRCLES.SOLARIS_HEADS['frog'];
            avatarNode.setAttribute("circles-color", {color:'white'});
            avatarFace.setAttribute("visible", "false")//makes face invisible by making the plane that the texture lies on invisible
            avatarFace.setAttribute("material", { src: CIRCLES.CONSTANTS.SOLARIS_FACE_NONE})//makes face invisible by changing face texture
            //if there would be an emit it would go here

          
           model = 5;

        }
        else if (itemType === "chicken"){//if item in the crypod is frog
            newHeadSrc = CIRCLES.SOLARIS_HEADS['chicken'];
            avatarNode.setAttribute("circles-color", {color:'white'});
            avatarFace.setAttribute("visible", "false")
            avatarFace.setAttribute("material", { src: CIRCLES.CONSTANTS.SOLARIS_FACE_NONE})//makes face invisible
            //here aswell

            
            model = 6;
        }
        else{
            console.log("Head did not change item type not found");
        }
        avatarNode.setAttribute("gltf-model", newHeadSrc);//if a new head was chosen then a change is made to the gltf pointer

        //Only useful for when player joins and leaves
        if (window.newURLSearchParams.has('head')){
            window.newURLSearchParams.set('head', model);//head=model#
            window.newURLSearchParams.set('head'+ '_col',{color:'white'});//head_col

            window.newURLSearchParams.set('face', "invisible");//


        }
        else{

            window.newURLSearchParams.append('head', model);
            window.newURLSearchParams.append('head'+ '_col',{color:'white'});
            window.newURLSearchParams.append('face', "invisible");//

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

