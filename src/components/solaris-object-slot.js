'use strict';



AFRAME.registerComponent('solaris-object-slot', {
  schema: {
    heldItemId:         {type: "string", default:"EMPTY"},
    pickupPosition:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //where do we want this relative to the camera
    pickupRotation:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //what orientation relative to teh camera
    pickupScale:        { type: "vec3", default:{x:1.0, y:1.0, z:1.0} },   //what scale relative to the camera
    dropPosition:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this to end up after it is released
    dropRotation:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },     //what scale after it is released
    enabled:            { type: "boolean", default:true },                      //whethere this works
  },
  init: function() {
    const CONTEXT_AF          = this;
    const data                = CONTEXT_AF.data;
    //states
    CONTEXT_AF.isHoldingItem  = false;
    CONTEXT_AF.rotationFudge  = 0.1;   //seems to be required to have some rotation on inspect so that it animates properly back to orig/dropRotation
    //player related
    CONTEXT_AF.playerHolder   = null;
    CONTEXT_AF.origParent     = null;
    //item related
    CONTEXT_AF.itemID    = "EMPTY";

    //add geometry
    CONTEXT_AF.el.setAttribute('geometry', {primitive:'box',width:1.2, height:1.2, depth:1.2});
    CONTEXT_AF.el.setAttribute('material', {color:'#40edb6', opacity:0.1});
    
    //this function will be called when circles is ready
    const setUp = function(){
      CONTEXT_AF.playerHolder = CIRCLES.getAvatarHolderElementBody();  //this is our player holder
      CONTEXT_AF.origParent = CONTEXT_AF.el.parentNode;
      
      //check if an item has been assigned to the item slot
      if (!(data.heldItemId === "EMPTY")){
         //if heldItem ID is not empty set the Context Variable to match and make know item held 
        CONTEXT_AF.itemID = data.heldItemId;
        CONTEXT_AF.isHoldingItem  = true;
        CONTEXT_AF.itemSetUp();
      }
      //console.log("Object Slot Ready. I am holding " + data.heldItemId);
    }
    
    //checking if circles is ready
    if (CIRCLES.isReady()) {
      setUp();
    }
    else {//if circles is not set up wait for it to be
      //setting up cuntion to be called by event listener
      const readyFunc = function() {
        setUp();
        CIRCLES.getCirclesSceneElement().removeEventListener(CIRCLES.EVENTS.READY, readyFunc);
      };
      //eventListner for when circles is set up
      CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, readyFunc);
    }
    //addign the on click event listner
    CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.clickFunc);
    
    CONTEXT_AF.el.sceneEl.addEventListener('lowerOP', function(event){
      CONTEXT_AF.lowerOpacity(event.detail.slotContext);
    });

    CONTEXT_AF.el.sceneEl.addEventListener('raiseOP', function(event){
      CONTEXT_AF.raiseOpacity(event.detail.slotContext);
    });
  },
  update: function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.enabled !== data.enabled) && (data.enabled !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {enabled:data.enabled});
    }

    if (oldData.heldItemId != data.heldItemId){
      //update Item ID
      CONTEXT_AF.itemID = data.heldItemId;
      //console.log("I received held item status change from update, I am holding " + CONTEXT_AF.itemID);//------------------------------------------------------------
      //check if empty
      if (CONTEXT_AF.itemID === "EMPTY"){
        CONTEXT_AF.isHoldingItem = false;
       // console.log("I am not holding an item");//-------------------------------------------------------------------------------------------------------------------
      }
      else{
        CONTEXT_AF.isHoldingItem = true;
       // console.log("I am  holding an item");//-----------------------------------------------------------------------------------------------------------------------
      }
    }
  },
  remove : function() {
    this.el.removeEventListener('click', this.clickFunc);
    CONTEXT_AF.el.removeEventListener('raiseOP', this.raiseOpacity);
    CONTEXT_AF.el.removeEventListener('lowerOP', this.lowerOpacity);
  },
  clickFunc : function(e) {
    console.log("Slot has been clicked!");//-----------------------------------------------------------------------------------------------------------------------
    const CONTEXT_AF = (e) ? e.srcElement.components['solaris-object-slot'] : this;
    
    //this just adds the # to the item id string because querySelector requires the #
    let itemTag = "#" + CONTEXT_AF.itemID;

    if (CONTEXT_AF.isHoldingItem === false){
      //let thing = document.querySelector(itemTag);
      //console.log("Item Found: " + thing);
      console.log("Emiting Event")
      CONTEXT_AF.el.emit('objectSlotClicked', {slotContext: CONTEXT_AF}, true);
      CONTEXT_AF.el.emit('lowerOP', {slotContext: CONTEXT_AF}, true);
      
    }
    else{
      //give to avatar if not already holding something in hand
      if (CIRCLES.getPickedUpElement() === null){
        let itemElement = document.querySelector(itemTag);
        //console.log("I am holding and item. Item Held: " + itemElement + " other verification"  + itemTag);
        itemElement.components["solaris-pickup-object"].parentToAvatar();
        //deparent
        CONTEXT_AF.isHoldingItem = false;
        CONTEXT_AF.itemID = "EMPTY";
        CONTEXT_AF.el.emit('raiseOP', {slotContext: CONTEXT_AF}, true);
      }
      else{
        console.log("Already something in hand");
      }
      
      
    }
  
  },
  itemSetUp: function(){
    //this is called at the start if the item slot is assigned an item to hold
    const CONTEXT_AF = this; 
    CONTEXT_AF.el.emit('setUpItem', {slotContext: CONTEXT_AF, itemID: CONTEXT_AF.itemID}, true);
  },
  getContext: function(e){
    //used by other components to get the context, technically not great protection but whatevs
    const CONTEXT_AF = (e) ? e.srcElement.components['circles-pickup-object'] : this;
    return this;
  },
  deParent: function(){
    //used by other components to update the item held to be empty
    const CONTEXT_AF = this;
    if (CONTEXT_AF.isHoldingItem){
      CONTEXT_AF.el.setAttribute("solaris-object-slot", {heldItemId:"EMPTY"})
     

    }
  },
  lowerOpacity: function(){
    const CONTEXT_AF = this.getContext();
    CONTEXT_AF.el.setAttribute("material", {opacity:0.1});
    
  },
  raiseOpacity:function(){
    const CONTEXT_AF = this.getContext();
    CONTEXT_AF.el.setAttribute("material", {opacity:0.9});

  },
  getHeldItemId: function(e){
    const CONTEXT_AF = (e) ? e.srcElement.components['solaris-object-slot'] : this;
    return CONTEXT_AF.itemID;
  },
  getHeldItemType: function(e){
    const CONTEXT_AF = (e) ? e.srcElement.components['solaris-object-slot'] : this;
    const itemID = CONTEXT_AF.itemID;
    const item = document.querySelector('#' + itemID);
    const itemType = item.srcElement.components['solaris-pickup-object'].getItemType(item.srcElement.components['solaris-pickup-object']);



  },
});


//proposed solution
/*on slot interact call object pick up if has held object. 
THe object handles it's own parenting, and de-parenting. Object is aware of slot and slot is aware of parent.
When an object gets a new parent, it calls og parent un parent function and parents itself to new parent*/

/*
so object slot functions:

init
onclick
set-child(itemId)
remove-child()
*/


