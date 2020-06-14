const fs = require("fs");

const path = require("path");

const DIR_NAME = "../codecs";
let CODEC_TYPES = {};
export const init = () => {
  const errs = [];
  fs.readdirSync(path.join(__dirname, DIR_NAME)).filter(file => file.slice(file.length - 3) === ".js" && file !== path.basename(__filename)).map(file => [file.slice(0, -3).replace("-", "").replace(".", "").replace(" ", "_").toUpperCase(), require(path.join(__dirname, DIR_NAME, file))]).forEach(e => {
    const err = validateCodec(...e);

    if (err) {
      errs.push(err);
    } else {
      CODEC_TYPES[e[0]] = e[1];
    }
  });
  if (errs.length !== 0) throw new Error(`Error(s) occurred while parsing: ${errs.join(", ")}`);
};
export const validateCodec = (key, codec) => {
  const propNames = ["name", "compressionRange", "ffmpegLib"];
  let err;
  propNames.forEach(name => {
    if (codec[name] === null || codec[name] === undefined) err = new Error(`Missing required codec property: ${name}`);
  });
  if (err) return err;
  if (!codec.compressionRange.min || !codec.compressionRange.max) return new Error("Invalid compression range");
  if (CODEC_TYPES[key]) return new Error(`Codec type for: (${key}) already exists`);
};
export const deleteCodecTypes = () => {
  CODEC_TYPES = {};
};
init();
export default CODEC_TYPES;
//# sourceMappingURL=codecs.js.map