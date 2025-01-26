export const eventMaps = {
  enter(event){
    return event.keyCode == 13 || event.which == 13 || event.key == 'Enter'
  },
  backspace(event){
    return event.keyCode == 8;
  },
  leftClick(event){
    return event.button === 0;
  },
  rightClick(event){
    return event.button === 2;
  },
  cosm(event,parent){
    return event.target.closest(parent)
  },
  clicked(event,elementClass){
    return event.target.closest(elementClass)
  },
  isNumber(event){
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
    return true;
  },

}
