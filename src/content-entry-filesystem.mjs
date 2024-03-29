import { join } from "node:path";
import { createReadStream, createWriteStream, constants } from "node:fs";
import { ReadableStream } from 'node:stream/web';
import { Readable, Writable } from "node:stream";
import { access, stat } from "node:fs/promises";
import { ContentEntry, StreamContentEntryMixin } from "content-entry";

/**
 * A ContentEntry backed by a file.
 */
export class FileSystemEntry extends StreamContentEntryMixin(ContentEntry) {
  /**
   * @param {string} name of the file
   * @param {string} baseDir directory the file is located in
   * @property {string} name of the file
   * @property {string} baseDir directory the file is located in
   */
  constructor(name, baseDir) {
    // @ts-ignore
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

  #stat;

  get size() {
    if (this.#stat) {
      return this.#stat.size;
    }

    return stat(this.filename).then(s => {
      this.#stat = s;
      return s.size;
    });
  }

  get mtime() {
    if (this.#stat) {
      return this.#stat.mtime;
    }

    return stat(this.filename).then(s => {
      this.#stat = s;
      return s.mtime;
    });
  }

  get uid() {
    if (this.#stat) {
      return this.#stat.uid;
    }

    return stat(this.filename).then(s => {
      this.#stat = s;
      return s.uid;
    });
  }

  get gid() {
    if (this.#stat) {
      return this.#stat.gid;
    }

    return stat(this.filename).then(s => {
      this.#stat = s;
      return s.gid;
    });
  }

  /**
   * @return {ReadableStream}
   */
  get readStream() {
    return Readable.toWeb(createReadStream(this.filename));
  }

  /**
   * @return {WritableStream}
   */
  get writeStream() {
    return Writable.toWeb(createWriteStream(this.filename));
  }

  toJSON() {
    const json = super.toJSON();
    json.baseDir = this.baseDir;
    return json;
  }

  /**
   * @deprecated
   */
  getReadStream(options) {
    return Readable.toWeb(createReadStream(this.filename, options));
  }

  /**
   * @deprecated
   */
  getWriteStream(options) {
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
