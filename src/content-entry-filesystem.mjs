import { join } from "node:path";
import { createReadStream, createWriteStream, constants } from "node:fs";
import { Readable, Writable } from "node:stream";
import { access, stat } from "node:fs/promises";
import { StreamContentEntry } from "content-entry";

/**
 * A ContentEntry backed by a file.
 */
export class FileSystemEntry extends StreamContentEntry {
  /** @type {string} */ baseDir;

  /**
   * @param {string} name of the file
   * @param {string|Object} options directory the file is located in
   * @property {string} name of the file
   * @property {object|string} options directory the file is located in
   * @property {string} options.basedir directory the file is located in
   */
  constructor(name, options) {
    super(name, options, async entry =>
      Readable.toWeb(createReadStream(entry.filename))
    );

    if (typeof options === "string") {
      this.baseDir = options;
    } else {
      this.baseDir = options.baseDir;
    }
  }

  /**
   * Absolute file path.
   * @return {string}
   */
  get filename() {
    return join(this.baseDir, this.name);
  }

  /**
   * Check for presence of the entry.
   * @return {Promise<boolean>|boolean}
   */
  get isExistent() {
    return exits(this.filename);
  }

  /**
   * Check is entry represents an empty file.
   * @return {Promise<boolean>|boolean}
   */
  get isEmpty() {
    return empty(this.filename);
  }

  getStat() {
    return this._stat || stat(this.filename).then(stat => (this._stat = stat));
  }

  /**
   * @return {number|Promise<number>}
   */
  get mode() {
    if (this._mode !== undefined) {
      return this._mode;
    }

    const stat = this.getStat();
    return stat.then
      ? stat.then(stat => {
          this._mode = stat.mode;
          return this._mode;
        })
      : stat.mode;
  }

  set mode(value) {
    super.mode = value;
  }

  /**
   * @return {number|Promise<number>}
   */
  get size() {
    const stat = this.getStat();
    return stat.then ? stat.then(stat => stat.size) : stat.size;
  }

  /**
   * @return {Promise<Date>}
   */
  get atime() {
    const stat = this.getStat();
    return stat.then ? stat.then(stat => stat.atime) : stat.atime;
  }

  /**
   * @return {Promise<Date>}
   */
  get ctime() {
    const stat = this.getStat();
    return stat.then ? stat.then(stat => stat.ctime) : stat.ctime;
  }

  /**
   * @return {Promise<Date>}
   */
  get mtime() {
    const stat = this.getStat();
    return stat.then ? stat.then(stat => stat.mtime) : stat.mtime;
  }

  /**
   * @return {Promise<number>}
   */
  get uid() {
    const stat = this.getStat();
    return stat.then ? stat.then(stat => stat.uid) : stat.uid;
  }

  /**
   * @return {Promise<number>}
   */
  get gid() {
    const stat = this.getStat();
    return stat.then ? stat.then(stat => stat.gid) : stat.gid;
  }

  /**
   * @return {WritableStream}
   */
  get writeStream() {
    return Writable.toWeb(createWriteStream(this.filename));
  }

  /**
   *
   * @returns {Object}
   */
  toJSON() {
    const json = super.toJSON();

    if (this._stat?.next || this._stat === undefined) {
      delete json.mode;
    } else {
      json.mode = this._stat.mode;
    }
    json.baseDir = this.baseDir;
    return json;
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

async function empty(file) {
  try {
    const s = await stat(file);
    return s.size === 0;
  } catch (e) {
    if (e.code === "ENOENT") {
      return true;
    }
    throw e;
  }
}
