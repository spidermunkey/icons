
const fs = require('fs-extra');
const path = require('path');

async function map_directory_files(directory){ // => {'filepath': lastModified}
    const directory_object = {};
    const directories = await fs.promises.readdir(directory, {withFileTypes: true});
        for (const item of directories) {
          const itemPath = path.join(directory, item.name);
          if (item.isDirectory()) {
            await map_directory_files(itemPath)
          } else if (item.isFile()) {
            const stats = await fs.promises.stat(itemPath);
            directory_object[itemPath] = stats.mtimeMs;
          }
    }
    return directory_object;
}

module.exports = map_directory_files;