module.exports.tryCatch = async function(func,message,...args){
    try {
        await func(...args)
    } catch(error){
        console.error(message,error)
        throw(error)
    }
}