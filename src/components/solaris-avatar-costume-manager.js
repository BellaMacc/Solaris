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
        
        const soundBank     = [ document.querySelector("#frogHead_sfx"),
                                document.querySelector("#chickenHead_sfx"),
                                document.querySelector("#appleHead_sfx"),
                                document.querySelector("#cowHead_sfx"),
                                document.querySelector("#robotHead_sfx"),]

        const data = CONTEXT_AF.data;

        //"headname", number of the head in its array
        function headSwap(headName, modelNum) {
            newHeadSrc = CIRCLES.SOLARIS_HEADS[headName];
            avatarNode.setAttribute("circles-color", {color:'white'});
            avatarFace.setAttribute("visible", "false")//makes face invisible by making the plane that the texture lies on invisible
            avatarFace.setAttribute("material", { src: CIRCLES.CONSTANTS.SOLARIS_FACE_NONE})//makes face invisible by changing face texture
            //if there would be an emit it would go here

            //plays sound effect and resets all other sound effects so they can be played again
            for (let i = 0; i < soundBank.length; i++){
                soundBank[i].setAttribute("circles-sound", {state:"stop"});
            }

            //5 is the number of other heads that are in the base circles - if those heads get removed, this number needs to change accordingly 
            soundBank[modelNum - 5].setAttribute("circles-sound", {state:"play"});
            model = modelNum;
        }

        console.log("Head Changing Received");

        //sets new head to default
        let newHeadSrc = CIRCLES.DEFAULT_GLTF_HEAD;
        let model = 0;
        if (itemType === "frog"){//if item in the crypod is frog
            headSwap("frog", 5)
        }
        else if (itemType === "chicken"){//if item in the crypod is frog
            headSwap("chicken", 6)
        }
        else if (itemType === "apple"){//if item in the crypod is frog
            headSwap("apple", 7)
        }
        else if (itemType === "cow"){//if item in the crypod is frog
            headSwap("cow", 8)
        }
        else if (itemType === "robot"){//if item in the crypod is frog
            headSwap("robot", 9)
        }
        else{
            console.log("Head did not change item type not found");
        }
        avatarNode.setAttribute("gltf-model", newHeadSrc);//if a new head was chosen then a change is made to the gltf pointer

        //Only useful for when player joins and leaves
        if (window.newURLSearchParams.has('head')){
            window.newURLSearchParams.set('head', model);//head=model#
            window.newURLSearchParams.set('head'+ '_col',{color:'white'});//head_col
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
        console.log("Fired");
        const itemType = info;

        CONTEXT_AF.changeHead(itemType);
    },
    

});

