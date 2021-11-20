import { ContentEntry, StreamContentEntryMixin } from "content-entry";
import { join } from "path";
import { createReadStream, createWriteStream, constants } from "fs";
import { access } from "fs/promises";

/**
 * A content entry backed by a file.
 * @param {string} name
 * @param {string} baseDir
 * 
 * @property {string} baseDir
 */
export class FileSystemEntry extends StreamContentEntryMixin(ContentEntry) {
  constructor(name, baseDir) {
    super(name);
    Object.defineProperties(this, { baseDir: { value: baseDir } });
  }

  /**
   * Absolute file path.
   * @return {string}
   */
  get filename() {
    return join(this.baseDir, this.name);
  }

  /**
   * Check for presence.
   * @return {boolean}
   */
  get isExistent() {
    return exits(this.filename);
  }

  get readStream() {
    return createReadStream(this.filename);
  }

  get writeStream() {
    return createWriteStream(this.filename);
  }

  toJSON() {
    const json = super.toJSON();
    json.baseDir = this.baseDir;
    return json;
  }

  /**
   * @deprecated
   */
  async getReadStream(options) {
    return createReadStream(this.filename, options);
  }

  /**
   * @deprecated
   */
  async getWriteStream(options) {
    return createWriteStream(this.filename, options);
  }
}

async function exits(file) {
  try {
    await access(file, constants.F_OK);
  } catch (e) {
    return false;
  }

  return true;
}
