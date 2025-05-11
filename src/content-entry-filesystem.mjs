import { join } from "node:path";
import { createReadStream, createWriteStream, constants } from "node:fs";
import { ReadableStream } from "node:stream/web";
import { Readable, Writable } from "node:stream";
import { access, stat } from "node:fs/promises";
import { ContentEntry, StreamContentEntry } from "content-entry";

/**
 * A ContentEntry backed by a file.
 */
export class FileSystemEntry extends StreamContentEntry {
  /** @type {string} */ baseDir;

  /**
   * @param {string} name of the file
   * @param {string} baseDir directory the file is located in
   * @property {string} name of the file
   * @property {string} baseDir directory the file is located in
   */
  constructor(name, baseDir) {
    // @ts-ignore
    super(name, undefined, async (entry) => Readable.toWeb(createReadStream(entry.filename)));
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
   * Check for presence of the entry.
   * @return {Promise<boolean>}
   */
  get isExistent() {
    return exits(this.filename);
  }

  /**
   * Check is entry represents an empty file.
   * @return {Promise<boolean>}
   */
  get isEmpty() {
    return empty(this.filename);
  }

  getStat() {
    return this._stat || stat(this.filename).then(stat => (this._stat = stat));
  }

  /**
   * @return {Promise<number>}
   */
  get mode() {
    const stat = this.getStat();
    return stat.then ? stat.then(stat => stat.mode) : stat.mode;
  }

  /**
   * @return {Promise<number>}
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
