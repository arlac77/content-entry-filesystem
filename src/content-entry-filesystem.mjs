import { ContentEntry,StreamContentEntryMixin } from "content-entry";
import { join } from "path";
import { createReadStream, createWriteStream, constants } from "fs";
import { access } from "fs/promises";

/**
 * A content entry backed by a file
 * @param {string} name
 * @param {string} baseDir
 */
export class FileSystemEntry extends StreamContentEntryMixin(ContentEntry) {
  constructor(name, baseDir) {
    super(name);
    Object.defineProperties(this, { baseDir: { value: baseDir } });
  }

  /**
   * absolute file path
   */
  get filename() {
    return join(this.baseDir, this.name);
  }

  /**
   * Check for presence
   */
  async getExists() {
    try { 
      await access(this.filename, constants.F_OK);
    }
    catch(e) {
      return false;
    }

    return true;
  }

  async getReadStream(options) {
    return createReadStream(this.filename, options);
  }

  async getWriteStream(options) {
    return createWriteStream(this.filename, options);
  }

  toJSON() {
    const json = super.toJSON();
    json.baseDir = this.baseDir;
    return json;
  }
}
