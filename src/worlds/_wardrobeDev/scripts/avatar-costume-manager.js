

AFRAME.registerComponent('avatar-costume-manager', {

    init: function(){
        setTimeout('10000');
        console.log("Head Changing");
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;
        const avatar        = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
        const avatarNode    = avatar.querySelector('.user_' + 'head');
        const modelPath = ('#frog_model' );
        avatarNode.setAttribute("gltf-model", modelPath);
    },
});

