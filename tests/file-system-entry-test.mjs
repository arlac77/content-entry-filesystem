import test from "ava";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

import { FileSystemEntry } from "content-entry-filesystem";

const here = dirname(fileURLToPath(import.meta.url));

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
  const entry = new FileSystemEntry("file.txt", join(here, "fixtures"));
  t.true(await entry.isExistent);
});

test("fs entry isExistent false", async t => {
  const entry = new FileSystemEntry(
    "none_existing.txt",
    join(here, "fixtures")
  );
  t.false(await entry.isExistent);
});

test("fs entry getString", async t => {
  const entry = new FileSystemEntry("file.txt", join(here, "fixtures"));
  t.is(await entry.getString(), "abc\n");
});

test("fs entry getReadStream", async t => {
  const entry = new FileSystemEntry("file.txt", join(here, "fixtures"));

  let chunk;
  for await (chunk of await entry.getReadStream({ encoding: "utf-8" })) {
  }

  t.is(chunk, "abc\n");
});

test("fs entry setString", async t => {
  const entry = new FileSystemEntry("file1.txt", "/tmp");
  await entry.setString("abc");
  t.is(await entry.getString(), "abc");
});

test("fs entry equals content true", async t => {
  const a = new FileSystemEntry("file.txt", join(here, "fixtures"));
  const b = new FileSystemEntry("file2.txt", "/tmp");
  await b.setString(await a.getString());
  t.true(await a.equalsContent(b));
});

test("fs entry equals content false", async t => {
  const a = new FileSystemEntry("file.txt", join(here, "fixtures"));
  const b = new FileSystemEntry("file3.txt", "/tmp");
  await b.setString("aaa");
  t.false(await a.equalsContent(b));
});
