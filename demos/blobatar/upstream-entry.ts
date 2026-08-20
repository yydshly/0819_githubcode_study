// Research adapter: re-export the fixed upstream implementation for the static lab.
// Bundled from vendor-projects/blobatar; no Blobatar geometry is reimplemented here.
export { blobatar, _layout, _parts } from "../../vendor-projects/blobatar/packages/blobatar/src/blobatar";
export { normalizeSeed } from "../../vendor-projects/blobatar/packages/blobatar/src/hash";
export { serializeVars } from "../../vendor-projects/blobatar/packages/blobatar/src/animate";
export { VERSION } from "../../vendor-projects/blobatar/packages/blobatar/src/index";
export {
  idle,
  happy,
  sad,
  mad,
  surprised,
  wink,
  sleepy,
  smug,
  unsure,
  scared,
  love,
  shy,
  sick,
  thinking,
} from "../../vendor-projects/blobatar/packages/blobatar/src/expression";
