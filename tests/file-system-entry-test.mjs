import test from "ava";
import { FileSystemEntry } from "content-entry-filesystem";


test("fs entry create", async t => {
  const entry = new FileSystemEntry("somewhere", "/tmp");
  t.is(entry.name, "somewhere");
  t.is(entry.filename, "/tmp/somewhere");
  t.is(entry.isCollection, false);
  t.is(entry.isBlob, true);
  t.is(await entry.isEmpty(), true);

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
  t.true(await entry.isExistent);
});

test("fs entry isExistent false", async t => {
  const entry = new FileSystemEntry(
    "none_existing.txt",
    new URL("fixtures", import.meta.url).pathname
  );
  t.false(await entry.isExistent);
});

test("fs entry getString", async t => {
  const entry = new FileSystemEntry("file.txt", new URL("fixtures", import.meta.url).pathname);
  t.is(await entry.string, "abc\n");
});

test("fs entry get string", async t => {
  const entry = new FileSystemEntry("file.txt", new URL("fixtures", import.meta.url).pathname);
  t.is(await entry.string, "abc\n");
});

test("fs entry getReadStream", async t => {
  const entry = new FileSystemEntry("file.txt", new URL("fixtures", import.meta.url).pathname);

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
  const a = new FileSystemEntry("file.txt", new URL("fixtures", import.meta.url).pathname);
  const b = new FileSystemEntry("file2.txt", "/tmp");
  await b.setString(await a.string);
  t.true(await a.equalsContent(b));
});

test("fs entry equals content false", async t => {
  const a = new FileSystemEntry("file.txt", new URL("fixtures", import.meta.url).pathname);
  const b = new FileSystemEntry("file3.txt", "/tmp");

  //b.string = "aaa";
  b.setString("aaa");
  t.false(await a.equalsContent(b));
});
