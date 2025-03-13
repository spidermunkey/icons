const Database = require('../Database.js');
const { uuid } = require('../../../utils/uuid.js');

const config = {
    document_alias: '[[meta_doc]]',
    collection_alias: '{{meta}}',
    configurable: ['preset','presets'],
    configure(props){
        const configurable = {};
        for (const prop in props){
            if (config.configurable.includes(prop)){
                configurable[prop] = props[prop]
            }
        }
        return configurable;
    },
}

async function connect(){
    return await Database.meta()
}