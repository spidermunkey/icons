const Database = require('../models/Database');
const Local = require('../models/Local');

async function db_connection(){
    const db_connection = await Database.ping()
    const ready  = Local.ready && db_connection
    const localOnly = Local.ready && !db_connection
    const onlineOnly = db_connection && !Local.ready
    const offline = !ready && !localOnly && !onlineOnly
    const message = ready ? 'ready' : localOnly ? 'local only' : onlineOnly ? 'online only' : 'server fault'
    const status = {
        mongo: db_connection,
        local: Local.ready,
        message,
    }
    return status
}

module.exports = async function(request,response,next){
    // app.locals.status = await db_connection();
    try {
        const status = await db_connection();
        if (!status.mongo){
            console.log('database not active...')
            console.log('blocking traffic...')
            return response.json({success:false,message:'db offline'})
        }
        next()
    } catch(error){
        console.log('Error checking DB connection',error);
        return response.json({success:false,message:'Error checking DB connection'})
    }
}