module.exports.objectIsEmpty = function(obj){
    for (const prop in obj) 
      if (Object.hasOwn(obj, prop)) 
        return false;
    return true;
}