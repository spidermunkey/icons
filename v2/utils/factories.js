// STRICTLY PRACTICE IN CREATING FACTORIES
export function elementFactory(e,cosm) {
    const el = e;
    let clickOutsideModal = cosm
    console.log(`element factory instantiated with: `, el);
    console.log(cosm,clickOutsideModal)
    const props = {}
    // ----------------------------------- //
    // CLASS METHODS //
    // ------------------------//
    function addClass(cls) {
        if(typeof cls === 'object'){
            // if array of classes
            for (let i = 0; i < cls.length; i++){
                // check for strings
                el.classList.add(cls[i]);
                console.log(`adding ${cls[i]} to ${el}`);
            }
            return true
        }
        return el.classList.add(cls);
    }

    function removeClass(cls){
        if(typeof cls === 'object'){
            for (let i = 0; i < cls.length; i++){
                // check for strings
                el.classList.remove(cls[i]);
                console.log(`removing ${cls[i]} to ${el}`);
            }
            return true
        }
        
        return el.classList.remove(cls);
    }

    function checkForCls(cls){
        return el.classList.contains(cls) ? true : false;
    }
    // ----------------------------------- //
    // DATASET METHODS //
    // ------------------------//
    function setState(dta){
        el.dataset.state = dta
    }
    function getState(el){
        if (el === undefined) {
            if(this.el.dataset.state) {
            return this.el.dataset.state;
            } 
        else { 
            return console.log('state not set')
            }
        }
        return el.dataset.state;
    }
    function setAttr(name,value){
        return el.dataset[name] = value;
    }
    function getAttr(name){
        return el.dataset[name];
    }
    function checkForDta(attr){
        return el.dataset.contains(attr) ? true : false;
    }
    // ----------------------------------- //
    // ANIMATION METHODS //
    // ------------------------//
    function trigger(cb){
        setTimeout(cb)
    }
    function triggerIn(cb,ms) {
        setTimeout(cb,ms)
    }
    function onClick(cb){
        el.addEventListener('click',cb);
    }
    function stopClick(cb){
        el.removeEventListener('click',cb);
    }
    function onHover(enter,leave){
        el.addEventListener('mouseenter',enter);
        if(leave){
            return el.addEventListener('mouseleave',leave)
        } else console.log('dont forget the mouseleave event')
    }
    function stopHover(enter,leave){
        el.removeEventListener('mouseenter',enter);
        el.removeEventListener('mouseleave',leave);
    }
    function onMouseOut(cb,removeListener) {
        el.addEventListener('mouseleave',function() {cb()});
        removeListener === true ? el.removeEventListener('mouseleave', cb): null;
    }

    function open(cb){
        // if(cb !== undefined && cb !== false){
        //     // SIDE EFFECT
        //     el.dataset.state = 'opened';
        //     return cb();
        // }
        if (clickOutsideModal) {
            clickOutsideModal.classList.add('open');
         }
        el.classList.add('open');
        if(clickOutsideModal) {
        clickOutsideModal.classList.add('open')
        }
        el.dataset.state = 'opened';
        if(cb !== undefined && cb !== false){
            cb();
        }
        return el.dataset.state;
        // console.log(window.getComputedStyle(el))
    }
    function close(cb){
        if(cb !== undefined && cb !== false){
            // SIDE EFFECT
            el.dataset.state = 'closed';
            return cb();
        }
        if (clickOutsideModal) {
           clickOutsideModal.classList.remove('open');
        }
        el.classList.remove('open');
        el.dataset.state = 'closed';
        return el.dataset.state;
    }

    function toggleOnState(on,onCb,off,offCb,option,optionCb) {
        el.dataset.state == on ? offCb() :
        el.dataset.state == off ? onCb()  :
        el.dataset.state == option ? optionCb() :
        console.log('something went wrong here') ;
    }

    function toggleOpenClose(cb) {
        cb != false ? cb() :
        el.dataset.state ? toggleOnState('opened', open, 'closed', close) :
        open();
    }
    
    function setOpenCloseToggler(elementTrigger,callbackOption=false){
        elementTrigger.addEventListener('click', function() {  toggleOpenClose(callbackOption)  });
    }

    function openOnClick(elementTrigger,callbackOption=false){
        elementTrigger.addEventListener('click', function() {  
            open(callbackOption) 
            document.querySelector('.sidebar').style.position = "absolute"
        });
        // SIDE EFFECT
        // elementTrigger.dataset.role = 'opener'
    }

    function closeOnClick(elementTrigger,callbackOption=false){
        elementTrigger.addEventListener('click',function() {  close(callbackOption)  });
        // SIDE EFFECT
        // elementTrigger.dataset.role = 'closer'
    }

    function setOpenCloseButtons(btnOpen,btnClose){
        openOnClick(btnOpen);
        closeOnClick(btnClose);
        return;
    }

    function setProps(props){
        // deconstruct props to set component actions with an object
    }

    return {
        el,
        addClass,
        removeClass,
        setState,
        getState,
        setAttr,
        getAttr,
        checkForCls,
        checkForDta,
        trigger,
        triggerIn,
        onClick,
        stopClick,
        onHover,
        onMouseOut,
        stopHover,
        toggleOnState,
        openOnClick,
        closeOnClick,
        setOpenCloseButtons,
        setOpenCloseToggler,
    }
}

function elementEventCallbacks() {
    function focusElement(elementToFocus) {
        return function() {
        elementToFocus.focus();
        }
    }
    return {
        focusElement,
    }
}

export const el = elementEventCallbacks();
// --> SPIN OUT <-- //
// transform: scale(0) rotateZ(-45deg) rotateY(-45deg);

// --> FOLD OUT <-- //
// transform: rotateY(-45deg) rotateZ(-2deg);
// transform-origin: left;
// transition: all 150ms ease;
// opacity: 0;
// --> TO
// transform: rotateY(0) rotateZ(0);
// opacity: 1;


// BACK UP IF STATEMENTS
        // if (cb !== false){
        //     return cb();
        // }
        // if (el.dataset.state) {
        //     toggleOnState('opened', open, 'closed', close);
        // } else {
        //     return open();
        // }