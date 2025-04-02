const fs = require('fs-extra');
const path = require('path');
const { uuid } = require('../utils/uuid.js');
const {from} = require('../utils/Date.js');
const {print} = require('../utils/print.js');

const {
  fileSystemMap,
  fileSystemDB,
} = require('./local/fsconfig.js');

module.exports.Scanner = {
  _targets: [],
  userTargets: path.join(__dirname,'local/fstargets.json'),
  fsmap: fileSystemMap,
  fsdb: fileSystemDB,
  stats:{},

  get targets(){
    return Array.from(this.readTargets())
    // return Array.from(this._targets.values());
  },

  async stat() {
      let count = await this.count()
      const last_sync_date = new Date(fs.statSync(fileSystemMap).mtimeMs).getTime()
      const lastChange = from(new Date(fs.statSync(fileSystemMap).mtimeMs))
      const { added , removed , changed } = await this.compare()
      const updateNeeded = [added,removed,changed].some(len => len > 0)
      const size = `${Math.floor(fs.statSync(fileSystemDB).size / 1000)} kb`
      return { 
        added, 
        removed, 
        changed, 
        size, 
        count, 
        updateNeeded,
        targets: this.readTargets(),
        lastChange: lastChange.string, 
        lastChangeMs:last_sync_date
      }
  },

  read(){
    return JSON.parse(fs.readFileSync(this.fsdb,'utf-8'))
  },

  read_map(){
    return JSON.parse(fs.readFileSync(this.fsmap))
  },

  async update_map(){
    fs.writeFileSync( this.fsmap, JSON.stringify(await this.create_flat_map(this.targets)))
  },

  overwrite(store){
    fs.writeFileSync( this.fsdb , JSON.stringify(store) )
  },

  ignore(name){
  },

  readTargets(targetFile = this.userTargets){
    try {
      if (fs.existsSync(targetFile)) {
        try {
          const targets = JSON.parse(fs.readFileSync(targetFile));
          const validTargets = targets.filter(fs.existsSync);
          return validTargets
        } catch (err) {
          console.error('Error parsing user targets:', err);
          return [];
        }
      } else {
        // create default target file
        const defaultTarget = "C:/Users/justi/dev/data/icons"
        fs.writeFileSync(path.join(__dirname,'local/fstargets.json'),JSON.stringify(defaultTarget? [`${defaultTarget}`]:[]))
        return [];
      }
    } catch (error){
      console.log('error reading target list',error)
    }

  },

  async addTarget(pathname){

    if (fs.existsSync(pathname)){
      // filter duplicates
      const targets = new Set(this.readTargets());
      const normalized = pathname.replace(/\\/g, '/');
      targets.add(normalized);
      const arr = Array.from(targets);
      fs.writeFileSync(this.userTargets,JSON.stringify(arr));
      console.log('added target', this.readTargets())
    } else {
      console.log('target not found',pathname)
    }
    return await this.compare()
  },

  async ignoreTarget(path){
    this._targets.delete(path);
    return await this.compare();
  },

  async compare(){
    console.log('comparing changes...')
    const prevState = this.read_map();
    const currState = await this.create_flat_map();
    const added = [];
    const removed = [];
    const changed = [];
  
    for (const file in currState)
      if (!prevState.hasOwnProperty(file)) added.push(file);
      else if (prevState[file] !== currState[file]) changed.push(file);
    
    for (const file in prevState)
      if (!currState.hasOwnProperty(file) && path.extname(file) === '.svg') removed.push(file);
    return { added:added.length, removed:removed.length, changed:changed.length }
  },

  async update(){
    console.log('overwriting current database...')
    await this.update_map();
    this.overwrite(await this.compile_repository(await this.read_map()));
  },

  async compile_targets(){

  },

  async compile_target(file_map){
    console.log('building object store')

  },

  async compile_repository(file_map){
    console.log('building local object store')
    const local = {
      collection_names: [],
      collections: {},
    };
    let progress = 0
    let files = Object.keys(file_map)
    for (const file of files){
      print(`processing file [${++progress}/${files.length}]`)
      if (path.extname(file) === '.svg'){
        const {repository,repository_id,collection,collection_id} = file_map[file]
        const entry = await this.parseFile(file,repository);
        const {subtype,sub_collection} = entry;

        const collection_exists = local.collections.hasOwnProperty(collection)
        const hasSubtype = subtype != undefined;
        const hasSubCollection = sub_collection != undefined;

        if (!collection_exists) {
          local.collections[collection] = {
            name: collection,
            cid: collection_id,
            rid: repository_id,

            subtypes: [],
            sub_collections: [],
            collection_type: 'local',
            icons: [],
            size: 0,
            ignored: false,
            synced: false,
            colors: {},
            color: {},
            presets:{},
            preset:{},
            created_at: Date.now(),
          }
          local.collection_names.push(collection)
        }

        let _collection = local.collections[collection];
        
        if (hasSubCollection && !_collection.sub_collections.includes(sub_collection))
          _collection.sub_collections.push(sub_collection)
        if (hasSubtype && !_collection.subtypes.includes(subtype)) 
          _collection.subtypes.push(subtype)

        entry.cid = _collection.cid
        _collection.icons.push(entry);
        _collection.size++;
      }
    }
    console.log('local object store ready');
    console.log(local.collection_names)
    return local;
  },

  async create_flat_map(directories = this.targets){
    return (await Promise.all(directories.map(this.mapDirectory))).reduce((acc,red) => {
      // flatten into one map
      return {
        ...acc,
        ...red,
      }},{})
  },

  async count(directories = this.targets){
      return (await Promise.all(directories.map(this.countDirectory))).reduce((acc,red) => acc + red,0);
  },

  async parseDirectory(directory){
    return await this.compile_repository(await this.mapDirectory(directory));
  },
  
  async parseFile(filepath,repository){
    const rootDir = repository
    const collection = getBranch(filepath)[0];
    const subtypeDirectories = ['duotone','bold','fill','light','regular','solid','outlined','outline','thin','medium','bulk','curved','light-outline','two-tone','broken'];
    const name = path.parse(filepath).name;
    const type = (await fs.stat(filepath)).isDirectory() ? 'directory' : 'file';
    const sub_collection = type == 'file' ? getSubCollection(filepath) : null;
    const ext = path.extname(filepath);
    const fileType = ext == '.svg' ? 'svg' 
                    : ext == '.zip' ? 'zip' 
                    : type == 'directory' ? 'directory' 
                    : null;
  
    let subtype = getSubType(filepath);
    let markup = fileType === 'svg' ? (await parseSVGFile(filepath)) : null;
    let id = fileType === 'svg' ? uuid() : null;
    let symlink = filepath;
    return { 
      name, 
      collection,
      sub_collection, 
      subtype, 
      fileType, 
      markup, 
      id, 
      symlink, 
      stamp: Date.now(),
      synced: false,
      ignored: false,
    }
  
    function getBranch(branchPath, branchStart = path.normalize(rootDir)) {
      const location = path.normalize(branchPath)
      const rootDir = path.normalize(branchStart)
      const folders = filename => filename.split(/[\\/]/);
      return folders(location.split(rootDir)[1]).filter(pathname => pathname != "")
    }
    function getSubCollection(dirname) {
      let branch = getBranch(dirname);
      let filteredCollectionName = branch.slice(1);
      let filteredFileName = filteredCollectionName.pop();
      let filterSubType = pathname => !subtypeDirectories.includes(pathname.toLowerCase())
      let filterSvgFolder = pathname => pathname.match(/(svg)(s?)/i) === null
      let filteredBranch = filteredCollectionName.filter(filterSubType).filter(filterSvgFolder);
      let code = filteredBranch.length;
      if (code === 1)
        return filteredBranch[0]
      else if (code === 0)
        return null
      else if (code > 1)
        return undefined;
    }
    function getSubType(dirname){
      let branch = getBranch(dirname)
      for (let folder of branch) {
        if (subtypeDirectories.includes(folder.toLowerCase()))
          return folder;
      }
      return null;
    }
    async function parseSVGFile(filepath) {
      let markup;
      let attemptRead = 0;
      await parse(filepath);
      return markup;
      async function parse(filepath){
        markup = await fs.readFile(filepath,'utf8');
        if (markup === '' && (await fs.exists(filepath)) && attemptRead < 3) {
          await new Promise(resolve => setTimeout(resolve, 50)); // wait for file to fully resolve
          attemptRead++;
          await parse(filepath);
        }
        if (markup == '' && attemptRead > 3)
          console.warn('download failed/n attempts: ',attemptRead,filepath);
        // markup = await gzip(markup);
        // if (!isValidSVG(markup))
        //   markup = ''
      }
    }
    function isValidSVG(markup) { //incomplete
      const trimmedMarkup = markup.trim();
      // Check if it starts with <svg> and contains the xmlns attribute
      return trimmedMarkup.startsWith('<svg') && trimmedMarkup.includes('xmlns="http://www.w3.org/2000/svg"') && trimmedMarkup.endsWith('</svg>');
    }
  },

  async mapDirectory(directory){
    const state = {};
    const repository = directory
    const repository_id = uuid();
    const collectionMemo = new Map();
    function getBranch(branchPath, branchStart = path.normalize(repository)) {
      const location = path.normalize(branchPath)
      const rootDir = path.normalize(branchStart)
      const folders = filename => filename.split(/[\\/]/);
      return folders(location.split(rootDir)[1]).filter(pathname => pathname != "")
    }
    await readDirRecursive(directory)
    async function readDirRecursive(directory){
      const items = await fs.promises.readdir(directory, {withFileTypes: true});
      for (const item of items) {
            const itemPath = path.join(directory, item.name);
            if (item.isDirectory())
              await readDirRecursive(itemPath)
            else if (item.isFile() && path.extname(itemPath) === '.svg') {
              const collection = getBranch(itemPath)[0]
              let collection_id;
              // assigning collection_id's early
              if (collectionMemo.has(collection)){
                collection_id = collectionMemo.collection
              } else {
                collection_id = uuid();
                collectionMemo.set(collection,collection_id)
              }
              const stats = await fs.promises.stat(itemPath);
              state[itemPath] = {
                collection,
                collection_id,
                repository,
                repository_id,

                synced:stats.mtimeMs
            }
          }
      }
    }
    return state;
  },

  async countDirectory(directory){
    let count = 0;
    await countDirRecursive(directory)
    async function countDirRecursive(directory){
      const items = await fs.promises.readdir(directory, {withFileTypes: true});
      for (const item of items){
        if (item.name.startsWith('.'))
          continue
        if (item.isDirectory()) {
          await countDirRecursive( path.join(directory, item.name) );
        } else if (item.isFile() && path.extname(item.name) === '.svg') {
          count++;
        }
      }
    }
    return count
  }
  
};