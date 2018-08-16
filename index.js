const mkdirp = require("mkdirp");
const zlib = require("zlib");
const path = require("path");

function unpack(moduleName, binaryDir) {
  const moduleFile = moduleName + ".node";
  const embedded_files = lumo.internal.embedded.keys();
  const embedded_binary_path = embedded_files.find(function(item) {
    return item.endsWith(moduleFile);
  });
  const binaryLoc = path.join(binaryDir, embedded_binary_path);

  if (!fs.existsSync(binaryLoc)) {
    const buffered_binary = lumo.internal.embedded.get(embedded_binary_path);
    const deflated_binary = zlib.inflateSync(buffered_binary);

    mkdirp.sync(path.dirname(binaryLoc));
    fs.writeFileSync(binaryLoc, deflated_binary, "binary", function(err) {
      if (err) {
        console.error("Could not unpack binding for:", moduleName, err);
        process.exit(-1);
      }
    });
  }

  return require(binaryLoc);
}

module.exports = unpack;
