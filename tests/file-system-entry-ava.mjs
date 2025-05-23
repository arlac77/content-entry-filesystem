import test from "ava";
import { StringContentEntry } from "content-entry";
import { FileSystemEntry } from "content-entry-filesystem";

test("fs entry create", t => {
  const entry = new FileSystemEntry("somewhere", "/tmp");
  t.is(entry.name, "somewhere");
  t.is(entry.filename, "/tmp/somewhere");

  /*
  t.deepEqual(JSON.parse(JSON.stringify(entry)), {
    name: "somewhere",
    baseDir: "/tmp",
    isBlob: true,
    isCollection: false
  });*/
});

test("fs entry create full options", t => {
  const entry = new FileSystemEntry("somewhere", {
    baseDir: "/tmp",
    mode: 0o444
  });
  t.is(entry.name, "somewhere");
  t.is(entry.filename, "/tmp/somewhere");
  t.is(entry.mode, 0o444);

  /*
  t.deepEqual(JSON.parse(JSON.stringify(entry)), {
    name: "somewhere",
    baseDir: "/tmp",
    isBlob: true,
    isCollection: false
  });*/
});

test("fs entry isExistent true + properties", async t => {
  const entry = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );
  t.is(await entry.size, 4);

  t.true((await entry.uid) > 100);
  t.true((await entry.gid) > 1);

  //t.deepEqual(await entry.mtime, new Date('2021-11-16 18:32:47.129+0000'));

  t.true(await entry.isExistent);
  t.false(await entry.isEmpty);
  t.is(await entry.mode, 0o100644); // 1st. time async
  t.is(entry.mode, 0o100644); // then sync
  t.true(entry.isBlob);
  t.false(entry.isCollection);

  t.deepEqual(JSON.parse(JSON.stringify(entry)), {
    baseDir: new URL("fixtures", import.meta.url).pathname,
    mode: 33188,
    name: "file.txt",
    isBlob: true,
    isCollection: false
  });
});

test("fs entry isExistent false", async t => {
  const entry = new FileSystemEntry(
    "none_existing.txt",
    new URL("fixtures", import.meta.url).pathname
  );
  t.false(await entry.isExistent);
  t.true(await entry.isEmpty);
});

test("fs entry get string", async t => {
  const entry = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );
  t.is(await entry.string, "abc\n");
});

test("fs entry get stream", async t => {
  const entry = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );

  let chunk;
  for await (chunk of await entry.stream) {
  }

  t.deepEqual(chunk, Uint8Array.of(97, 98, 99, 0x0a));
});

test("fs copy stream", async t => {
  const entry = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );

  let chunk;
  for await (chunk of await entry.stream) {
  }

  t.deepEqual(chunk, Uint8Array.of(97, 98, 99, 0x0a));
});

/*
test("fs entry getReadStream", async t => {
  const entry = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );

  let chunk;
  for await (chunk of await entry.getStream({ encoding: "utf8" })) {
  }

  t.is(chunk, "abc\n");
});

test("fs entry setString", async t => {
  const entry = new FileSystemEntry("file1.txt", "/tmp");
  await entry.setString("abc");
  t.is(await entry.string, "abc");
});

test("fs entry equals content true", async t => {
  const a = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );
  const b = new FileSystemEntry("file2.txt", "/tmp");
  await b.setString(await a.string);
  t.true(await a.equalsContent(b));
});*/

test("fs entry equals content false", async t => {
  const a = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );
  const b = new StringContentEntry("file3.txt", undefined, "aaa");

  try {
    t.false(await a.equalsContent(b));
  } catch (e) {
    t.true(true);
  }
});

test("fs entry times", async t => {
  const file = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );

  t.true((await file.mtime).getFullYear() >= 2020, "mtime");
  t.true((await file.ctime).getFullYear() >= 2020, "ctime");
});
