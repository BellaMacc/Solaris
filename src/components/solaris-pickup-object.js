'use strict';

AFRAME.registerComponent('solaris-pickup-object', {
  schema: {
    itemType:           {type: "string", default:''},
    itemID:             {type: "string", default:''},
    parentID:           {type: "string", defailt:''},
    pickupPosition:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //where do we want this relative to the camera
    pickupRotation:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //what orientation relative to teh camera
    pickupScale:        { type: "vec3", default:{x:1.0, y:1.0, z:1.0} },   //what scale relative to the camera
    dropPosition:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this to end up after it is released
    dropRotation:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this to orient as after it is released
    enabled:            { type: "boolean", default:true },                      //whethere this works
  },
  init: function() {
    const CONTEXT_AF          = this;
    const data                = CONTEXT_AF.data;
    CONTEXT_AF.pickedUp       = false;
    CONTEXT_AF.rotationFudge  = 0.1;   //seems to be required to have some rotation on inspect so that it animates properly back to orig/dropRotation

    CONTEXT_AF.playerHolder   = null;
    CONTEXT_AF.origParent     = null;

    
    if (CIRCLES.isReady()) {
      CONTEXT_AF.playerHolder = CIRCLES.getAvatarHolderElementBody();  //this is our player holder
      CONTEXT_AF.origParent = CONTEXT_AF.el.parentNode;
      console.log("Pickup Object Ready");
    }
    else {
      const readyFunc = function() {
        CONTEXT_AF.playerHolder = CIRCLES.getAvatarHolderElementBody();  //this is our player holder
        CONTEXT_AF.origParent   = CONTEXT_AF.el.parentNode;
        CIRCLES.getCirclesSceneElement().removeEventListener(CIRCLES.EVENTS.READY, readyFunc);
        console.log("Pickup Object Ready");

      };
      CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, readyFunc);
    }
    CONTEXT_AF.el.addEventListener('objectSlotClicked',function(event){
      CONTEXT_AF.putDown(event.detail.slotContext);
    });
  },
  update: function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.enabled !== data.enabled) && (data.enabled !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {enabled:data.enabled});
    }
  },
  remove : function() {
   
  },
  pickup : function(sendNetworkEvent, passedContext) {
    const CONTEXT_AF    = (passedContext) ? passedContext : this;
    const data          = CONTEXT_AF.data;
    const SAME_DIFF     = 0.001;

    CONTEXT_AF.playerHolder.object3D.attach(CONTEXT_AF.el.object3D);

    const thisPos = {x:CONTEXT_AF.el.object3D.position.x, y:CONTEXT_AF.el.object3D.position.y, z:CONTEXT_AF.el.object3D.position.z};
    const thisRot = {x:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.x), y:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.y), z:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.z)};
    const thisSca = {x:CONTEXT_AF.el.object3D.scale.x, y:CONTEXT_AF.el.object3D.scale.y, z:CONTEXT_AF.el.object3D.scale.z};

    const pickupPos  = (data.pickupPosition.x < 100001.0) ? {x:data.pickupPosition.x, y:data.pickupPosition.y, z:data.pickupPosition.z} : thisPos;
    const pickupRot  = (data.pickupRotation.x < 100001.0) ? {x:data.pickupRotation.x, y:data.pickupRotation.y, z:data.pickupRotation.z} : thisRot;
    const pickupSca  = (data.pickupScale.x < 100001.0) ? {x:data.pickupScale.x, y:data.pickupScale.y, z:data.pickupScale.z} : thisSca;

    //set pickup transforms
    
    CONTEXT_AF.el.object3D.position.set(pickupPos.x, pickupPos.y, pickupPos.z);
    CONTEXT_AF.el.object3D.rotation.set(pickupRot.x, pickupRot.y, pickupRot.z);
    CONTEXT_AF.el.object3D.scale.set(pickupSca.x, pickupSca.y, pickupSca.z);
    

    CONTEXT_AF.pickedUp = true;

    //let others know
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, {sendNetworkEvent:sendNetworkEvent}, true);
    CIRCLES.getCirclesManagerElement().emit(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, {el:CONTEXT_AF.el}, false);
  },
  release : function(sendNetworkEvent, passedContext) {
    const CONTEXT_AF  = (passedContext) ? passedContext : this;
    const data        = CONTEXT_AF.data;
    const SAME_DIFF   = 0.001;

    //release
    CONTEXT_AF.origParent.object3D.attach(CONTEXT_AF.el.object3D); //using three's "attach" allows us to retain world transforms during pickup/release

    const thisPos = {x:CONTEXT_AF.el.object3D.position.x, y:CONTEXT_AF.el.object3D.position.y, z:CONTEXT_AF.el.object3D.position.z};
    const thisRot = {x:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.x), y:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.y), z:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.z)};
    const thisSca = {x:CONTEXT_AF.el.object3D.scale.x, y:CONTEXT_AF.el.object3D.scale.y, z:CONTEXT_AF.el.object3D.scale.z};

    const dropPos  = (data.dropPosition.x < 100001.0) ? {x:data.dropPosition.x, y:data.dropPosition.y, z:data.dropPosition.z} : thisPos;
    const dropRot  = (data.dropRotation.x < 100001.0) ? {x:data.dropRotation.x, y:data.dropRotation.y, z:data.dropRotation.z} : thisRot;
    const dropSca  = (data.dropScale.x < 100001.0) ? {x:data.dropScale.x, y:data.dropScale.y, z:data.dropScale.z} : thisSca;

    let artReleaseTimeout = null;

    
    CONTEXT_AF.el.setAttribute('position', {x:dropPos.x, y:dropPos.y, z:dropPos.z});
    CONTEXT_AF.el.setAttribute('rotation', {x:dropRot.x, y:dropRot.y, z:dropRot.z});
    CONTEXT_AF.el.setAttribute('scale', {x:dropSca.x, y:dropSca.y, z:dropSca.z});

    //send off event for others
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {sendNetworkEvent:sendNetworkEvent}, true);
    CIRCLES.getCirclesManagerElement().emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {el:CONTEXT_AF.el}, false);
      
    releaseEventFunc();
    

    //set drop transforms, if any
    
    
    CONTEXT_AF.el.object3D.position.set(dropPos.x, dropPos.y, dropPos.z);
    CONTEXT_AF.el.object3D.rotation.set(dropRot.x, dropRot.y, dropRot.z);
    CONTEXT_AF.el.object3D.scale.set(dropSca.x, dropSca.y, dropSca.z);
    

    CONTEXT_AF.pickedUp = false;

    //sending a "pre" event to turn off controls before any animations might be done
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT_PRE, null, true);
  },
  reparent : function(parentObject3D, parentType) { //parentTyoe = True for pickup and False for release
    const CONTEXT_AF = this;
    if (CONTEXT_AF.pickedUp === true) {
      CONTEXT_AF.release(true, CONTEXT_AF);
    }
    else {
      CONTEXT_AF.pickup(true, CONTEXT_AF);
    }
  },
  getItemType: function(){

  },
  getID: function(){

  },
  setParent: function(parent){

  },
  getParent: function(){

  },
  putDown: function(slotContext){
    const CONTEXT_AF = this;
    console.log("Placing request from slot received, my id is " + CONTEXT_AF.el.getAttribute('id'))
    slotContext.el.setAttribute('circles-interactive-object', {heldItemId:CONTEXT_AF.el.getAttribute('id')});
    if (CONTEXT_AF.pickedUp === true) {
      console.log(("I will be parented to " + slotContext));
    }
  }
});