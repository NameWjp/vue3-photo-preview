const fs = require('fs');
const path = require('path');

/**
 * @description Promise fs.readdir
 * @param {String|Buffer|URL|FileHandle} path Path
 * @return {Promise} Promise
 */
function readDir (path) {
  return new Promise(resolve => {
    fs.readdir(path, (err, paths) => {
      if (err) {
        console.error(err);

        resolve(false);
      }

      resolve(paths);
    });
  });
}

/**
 * @description Promise fs.stat
 * @param {String|Buffer|URL} path Path
 * @param {Object} options         Options
 * @return {Promise} Promise
 */
function stat (path, options = {}) {
  return new Promise(resolve => {
    fs.stat(path, options, (err, stats) => {
      if (err) {
        console.error(err);

        resolve(false);
      }

      resolve(stats);
    });
  });
}

/**
 * @description Promise fs.mkdir
 * @param {String|Buffer|URL} path Path
 * @param {Object} options         Options
 * @return {Promise} Promise
 */
function mkDir (path, options = {}) {
  return new Promise(resolve => {
    fs.mkdir(path, options, err => {
      if (err) {
        console.error(err);

        resolve(false);
      }

      resolve(true);
    });
  });
}

/**
 * @description Promise fs.access
 * @param {String|Buffer|URL} path Path
 * @param {Number} mode Mode
 * @return {Promise} Promise
 */
function access (path, mode = fs.constants.F_OK) {
  return new Promise(resolve => {
    fs.access(path, mode, err => {
      if (err) {
        resolve(false);

        return;
      }

      resolve(true);
    });
  });
}

/**
 * @description Promise fs.unlink
 * @param {String|Buffer|URL} path Path
 * @return {Promise} Promise
 */
function unlink (path) {
  return new Promise(resolve => {
    fs.unlink(path, err => {
      if (err) {
        console.error(err);

        resolve(false);
      }

      resolve(true);
    });
  });
}

/**
 * @description Promise fs.rmdir
 * @param {String|Buffer|URL} path Path
 * @return {Promise} Promise
 */
function rmDir (path) {
  return new Promise(resolve => {
    fs.rmdir(path, err => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * @description Recursively empty the folder,
 * the folder will be created if it does not exist.
 * @param {String} src Folder path
 * @return {Promise} Promise will return a Boolean value
 */
async function clearDir (src) {
  const isExists = await access(src);

  if (!isExists) {
    await mkDir(src);

    return true;
  }

  return await emptyDir(src);
}

/**
 * @description Recursively empty the folder.
 * @param {String} src Folder path
 * @return {Promise} Promise will return a Boolean value
 */
async function emptyDir (src) {
  const paths = await readDir(src);
  if (!paths) {
    console.error('Exception in emptyDir: paths!');

    return false;
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i];
    const stats = await stat(fullSrc);

    if (!stats) {
      console.error('Exception in emptyDir: stats!');

      return false;
    }

    if (stats.isFile()) {
      const isUnlink = await unlink(fullSrc);

      if (!isUnlink) {
        console.error('Exception in emptyDir: isUnlink!');

        return false;
      }
    } else if (stats.isDirectory()) {
      const isEmpty = await emptyDir(fullSrc);

      if (!isEmpty) {
        console.error('Exception in emptyDir: isEmpty!');

        return false;
      }

      if (!await rmDir(fullSrc)) {
        console.error('Exception in emptyDir: rmDir!');

        return false;
      }
    }
  }

  return true;
}

/**
 * @description Delete the specified extname file.
 * @param {String} src             Folder path
 * @param {Array<String>} extnames Extnames
 * @return {Promise} Promise will return a Boolean value
 */
async function unlinkDirFileByExtname (src, extnames = []) {
  const paths = await readDir(src);

  if (!paths) {
    console.error('Exception in unlinkDirFileByExtname: paths!');

    return false;
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i];
    const stats = await stat(fullSrc);

    if (!stats) {
      console.error('Exception in unlinkDirFileByExtname: stats!');

      return false;
    }

    if (stats.isFile()) {
      const cxtname = path.extname(fullSrc);
      if (extnames.findIndex(name => name === cxtname) === -1) continue;

      const isUnlink = await unlink(fullSrc);
      if (!isUnlink) {
        console.error('Exception in unlinkDirFileByExtname: isUnlink!');

        return false;
      }
    } else if (stats.isDirectory()) {
      const recursive = await unlinkDirFileByExtname(fullSrc, extnames);

      if (!recursive) {
        console.error('Exception in unlinkDirFileByExtname: recursive!');

        return false;
      }
    }
  }

  return true;
}

/**
 * @description Copy the folder to the specified location.
 * If the folder already exists in the specified location,
 * the folder will be cleared.
 * @param {String} src  Folder path
 * @param {String} dest Destination folder path
 * @return {Promise} Promise will return a Boolean value
 */
async function copyDir (src, dest) {
  if (!src || !dest) {
    console.error('copyDir: Missing parameters!');

    return false;
  }

  const isClear = await clearDir(dest);

  if (!isClear) {
    console.error('Exception in copyDir: isClear!');

    return false;
  }

  const paths = await readDir(src);
  if (!paths) {
    console.error('Exception in copyDir: paths!');

    return false;
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i];
    const fullDest = dest + '/' + paths[i];
    const stats = await stat(fullSrc);

    if (!stats) {
      console.error('Exception in copyDir: stats!');

      return false;
    }

    if (stats.isFile()) {
      fs.createReadStream(fullSrc).pipe(fs.createWriteStream(fullDest));
    } else if (stats.isDirectory()) {
      const isMkdir = await mkDir(fullDest);

      if (!isMkdir) {
        console.error('Exception in copyDir: isMkdir!');

        return false;
      }

      const isCopy = await copyDir(fullSrc, fullDest);

      if (!isCopy) {
        console.error('Exception in copyDir: isCopy!');

        return false;
      }
    }
  }

  return true;
}

/**
 * @description Recursively traverse all files or directory.
 * @param {String} src       Folder path
 * @param {Funtion} callback Callback
 * @return {Promise} Promise
 */
async function fileOrDirForEach(src, callback) {
  if (!src || !callback) {
    console.error('fileForEach missing parameters!');

    return false;
  }

  const paths = await readDir(src);
  if (!paths) {
    console.error('Exception in fileForEach: paths!');

    return false;
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i];
    const stats = await stat(fullSrc);

    if (!stats) {
      console.error('Exception in fileForEach: stats!');

      return false;
    }

    if (stats.isFile()) {
      await callback({ src: fullSrc, isFile: true });
    } else if (stats.isDirectory()) {
      await callback({ src: fullSrc, isFile: false });
      const recursive = await fileOrDirForEach(fullSrc, callback);

      if (!recursive) {
        console.error('Exception in fileForEach: recursive!');

        return false;
      }
    }
  }

  return true;
}

/**
 * @description Recursively traverse all files.
 * @param {String} src       Folder path
 * @param {Funtion} callback Callback
 * @return {Promise} Promise
 */
async function fileForEach (src, callback) {
  if (!src || !callback) {
    console.error('fileForEach missing parameters!');

    return false;
  }

  const paths = await readDir(src);
  if (!paths) {
    console.error('Exception in fileForEach: paths!');

    return false;
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i];
    const stats = await stat(fullSrc);

    if (!stats) {
      console.error('Exception in fileForEach: stats!');

      return false;
    }

    if (stats.isFile()) {
      await callback(fullSrc);
    } else if (stats.isDirectory()) {
      const recursive = await fileForEach(fullSrc, callback);

      if (!recursive) {
        console.error('Exception in fileForEach: recursive!');

        return false;
      }
    }
  }

  return true;
}

/**
 * @description fs.readFile
 * @param {String|Buffer|URL|Integer} path File path
 * @param {Object|String} options          Options
 * @return {Promise} Promise
 */
async function readFile (path, options = 'utf8') {
  return new Promise(resolve => {
    fs.readFile(path, options, (err, data) => {
      if (err) {
        console.error(err);

        resolve(false);
      } else {
        resolve(data);
      }
    });
  });
}

/**
 * @description fs.writeFile
 * @param {String|Buffer|URL|Integer} path         File path
 * @param {String|Buffer|TypedArray|DataView} data Data
 * @param {Object|String} options                  Options
 * @return {Promise} Promise will return a Boolean value
 */
async function writeFile (src, data, option = 'utf8') {
  return new Promise(resolve => {
    fs.writeFile(src, data, option, err => {
      if (err) {
        console.error(err);

        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

/**
 * @description Recursively traverse all folders.
 * @param {String} src       Folder path
 * @param {Funtion} callback Callback
 * @return {Promise} Promise
 */
async function dirForEach (src, callback) {
  if (!src || !callback) {
    console.error('dirForEach: Missing parameters!');

    return false;
  }

  const paths = await readDir(src);
  if (!paths) {
    console.error('Exception in dirForEach: paths!');

    return false;
  }

  for (let i = 0; i < paths.length; i++) {
    const fullSrc = src + '/' + paths[i];
    const stats = await stat(fullSrc);

    if (!stats) {
      console.error('Exception in dirForEach: stats!');

      return false;
    }

    if (stats.isDirectory()) await callback(fullSrc);
  }

  return true;
}

module.exports = {
  stat,
  mkDir,
  copyDir,
  readDir,
  clearDir,
  emptyDir,
  readFile,
  writeFile,
  dirForEach,
  fileForEach,
  fileOrDirForEach,
  unlinkDirFileByExtname
};
