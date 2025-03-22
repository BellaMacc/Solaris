'use strict';

AFRAME.registerComponent('solaris-costume-button', {
    schema: {
        slotID:   {type: "string", default:""},
    },
    init: function () {
      const CONTEXT_AF = this;
      const data = CONTEXT_AF.data;

      CONTEXT_AF.slotID = data.slotID;
      CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.onClick);
      
    },
    update : function(oldData) {
      
    },
    onClick : function (e){
        const CONTEXT_AF = (e) ? e.srcElement.components['solaris-costume-button'] : this;
        const mySlot = document.querySelector('#slot1');
        console.log("Geting info from slot with id #" + mySlot.getAttribute('id'));
        const slotContext = mySlot.components['solaris-object-slot'];
        const heldItemID = slotContext.getHeldItemId();
       
        if (!(heldItemID === "EMPTY")  && !(heldItemID === null )){
            const heldItemType =  document.querySelector('#' + heldItemID).components['solaris-pickup-object'].getItemType();
            console.log("Sending request to get head type " +  heldItemType)
            mySlot.emit('changeCostume', {itemType:heldItemType}, true)
        }
        else{
            console.log("Item type is invalid");
        }
        
    },
  });