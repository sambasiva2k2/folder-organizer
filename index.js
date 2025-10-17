const fs = require("fs");
const Path = require("path");
const readline = require("node:readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const typeFolders = require("./extension-types");



rl.question(`Enter the path of the unorganized folder : `, (inputPath) => {
  let path = Path.resolve(inputPath);
  if (!path) {
    throw new Error("Please provide the path");
  }

  let exists = fs.existsSync(path);

  if (!exists) {
    throw new Error("Provided path is not found");
  }

  fs.readdir(path, { withFileTypes: true }, (err, files) => {
    if (err) {
      throw err;
    }
    if (files.length == 0) {
      throw new Error("No files found in the provided path");
    }
    for (let file of files) {
      if (file.isDirectory()) {
        //Ignore
        console.log("Ignoring a folder : " + file.name)
      } else {
        let extension = file.name
          .split(".")
          [file.name.split(".").length - 1].toLowerCase();
        if (extension in typeFolders) {
          let oldPath = Path.join(path, file.name) 
          let newFolder = Path.join(path, typeFolders[extension]);
          let newPath = Path.join(path, typeFolders[extension], file.name)  
          let exists = fs.existsSync(newFolder);
          if (!exists) {
            fs.mkdirSync(newFolder);
          }
          try {
            fs.rename(oldPath, newPath, (err) => {
              if (err) {
                console.log(err);
              }
              console.log("Done");
            });
          } catch (err) {
            console.log(err);
          }
        } else {
          let oldPath = Path.join(path, file.name) 
          let newFolder = Path.join(path, "Other")
          let newPath = Path.join(path, "Other", file.name)
          let exists = fs.existsSync(newFolder);
          if (!exists) {
            fs.mkdirSync(newFolder);
          }
          try {
            fs.rename(oldPath, newPath, (err) => {
              if (err) {
                console.log(err);
              }
              console.log("Done");
            });
          } catch (err) {
            console.log(err);
          }
        }
      }
    }
  });

  rl.close();
});
