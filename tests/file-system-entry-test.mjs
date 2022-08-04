import test from "ava";
import { FileSystemEntry } from "content-entry-filesystem";

test("fs entry create", async t => {
  const entry = new FileSystemEntry("somewhere", "/tmp");
  t.is(entry.name, "somewhere");
  t.is(entry.filename, "/tmp/somewhere");

  t.deepEqual(JSON.parse(JSON.stringify(entry)), {
    name: "somewhere",
    baseDir: "/tmp",
    isBlob: true,
    isCollection: false
  });
});

test("fs entry isExistent true", async t => {
  const entry = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );
  t.is(await entry.size, 4);
  t.true(await entry.isExistent);
  t.false(await entry.isEmpty);
  t.true(await entry.isBlob);
  t.false(await entry.isCollection);
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

test("fs entry get readStream", async t => {
  const entry = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );

  let chunk;
  for await (chunk of await entry.readStream) {
  }

  t.deepEqual(chunk, Buffer.from(Uint8Array.of(97, 98, 99, 0x0a)));
});

test("fs entry getReadStream", async t => {
  const entry = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );

  let chunk;
  for await (chunk of await entry.getReadStream({ encoding: "utf-8" })) {
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
});

test("fs entry equals content false", async t => {
  const a = new FileSystemEntry(
    "file.txt",
    new URL("fixtures", import.meta.url).pathname
  );
  const b = new FileSystemEntry("file3.txt", "/tmp");

  //b.string = "aaa";
  b.setString("aaa");
  t.false(await a.equalsContent(b));
});
