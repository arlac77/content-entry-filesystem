import { join } from "path";
import { createReadStream, createWriteStream, constants } from "fs";
import { access } from "fs/promises";
import { ContentEntry, StreamContentEntryMixin } from "content-entry";

/**
 * A content entry backed by a file.
 * @param {string} name of the file
 * @param {string} baseDir directory the file is located in
 * 
 * @property {string} name of the file
 * @property {string} baseDir directory the file is located in
 */
export class FileSystemEntry extends StreamContentEntryMixin(ContentEntry) {
  constructor(name, baseDir) {
    super(name);
    this.baseDir = baseDir;
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
   * @return {Promise<boolean>}
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
  } catch {
    return false;
  }

  return true;
}
