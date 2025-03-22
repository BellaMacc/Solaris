'use strict';

AFRAME.registerComponent('solaris-costume-button', {
    schema: {
        slotID:   {type: "string", default:"slot1"},
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
        const mySlot = document.querySelector('#'+ CONTEXT_AF.slotID);
        const slotContext = mySlot.srcElement.components['solaris-object-slot'].getContext(mySlot.srcElement.components['solaris-object-slot']);
        const heldItemID = slotContext.getHeldItemId(slotContext);

        if (!(heldItemID === "EMPTY")){
            const heldItemType = slotContext.getHeldItemType(slotContext);
            CONTEXT_AF.el.emit('changeCostume', {itemType:heldItemType}, true)
        }
        else{
            console.log("Item type is invalid");
        }
        
    },
  });