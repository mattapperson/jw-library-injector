import temp from 'temp';
import archiver from 'archiver';
import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3'

export class FilesAdapter {
  constructor() {

  }
  createJWpubFile = async (filePaths) => {
    console.log(filePaths)
    // Automatically track and cleanup files at exit 
    temp.track();

    // The *.jwpub format is a db + file zipped up inside a zip... so...
    var { db, dbPath } = await this._createDB();

    this._insertFilesIntoDB(db, filePaths);

    filePaths.push(dbPath);

    var content = this._createZipStreamFromContent(filePaths)

    var manafest = this._createManafest()

    var output = this._createJWpub(manafest, content)

    //TODO do something with the output
  }

  async _createDB() {
    return new Promise((resolve, reject) => {
      fs.readFile('./base.db', function (err, data) {
        temp.open({ suffix: '.db', prefix: 'newfiles' }, function (err, info) {
          if (err) return reject(err);
          fs.write(info.fd, contents);
          fs.close(info.fd, function (err) {
            if (err) return reject(err);

            var db = new sqlite3.Database(info.fd);

            db.serialize(function () {
              resolve({ db, dbPath: info.fd })
            })
          });
        });
      });
    })
  }

  _insertFilesIntoDB(db, filePaths) {
    // TODO need to sort out the queries still
    filePaths.forEach(path => {
      db.run("INSERT INTO bar VALUES (?)", 1);
    })
  }

  _createManafest() {
    // TODO need to create the manifests still
    throw 'NEED TO CREATE MANAFEST STILL!!!'
  }

  _createZipStreamFromContent(filePaths) {
    var outputStream = temp.createWriteStream();

    const archive = this._createZip(contentOutput);

    filePaths.forEach(filePath => {
      let fileName = path.basename(filePath)
      archive.append(fs.createReadStream(filePath), { name: fileName });
    })

    archive.finalize();

    return outputStream;
  }

  _createZip(output) {
    var archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function (err) {
      if (err.code === 'ENOENT') {
        console.log(err)
      } else {
        // throw error
        throw err;
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', function (err) {
      throw err;
    });

    // pipe archive data to the file
    archive.pipe(output);

    return archive
  }

}