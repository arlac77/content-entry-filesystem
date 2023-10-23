[![npm](https://img.shields.io/npm/v/content-entry-filesystem.svg)](https://www.npmjs.com/package/content-entry-filesystem)
[![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause)
[![bundlejs](https://deno.bundlejs.com/?q=content-entry-filesystem\&badge=detailed)](https://bundlejs.com/?q=content-entry-filesystem)
[![downloads](http://img.shields.io/npm/dm/content-entry-filesystem.svg?style=flat-square)](https://npmjs.org/package/content-entry-filesystem)
[![GitHub Issues](https://img.shields.io/github/issues/arlac77/content-entry-filesystem.svg?style=flat-square)](https://github.com/arlac77/content-entry-filesystem/issues)
[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Farlac77%2Fcontent-entry-filesystem%2Fbadge\&style=flat)](https://actions-badge.atrox.dev/arlac77/content-entry-filesystem/goto)
[![Styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Known Vulnerabilities](https://snyk.io/test/github/arlac77/content-entry-filesystem/badge.svg)](https://snyk.io/test/github/arlac77/content-entry-filesystem)
[![Coverage Status](https://coveralls.io/repos/arlac77/content-entry-filesystem/badge.svg)](https://coveralls.io/github/arlac77/content-entry-filesystem)
    *   [Parameters](#parameters)
    *   [Properties](#properties)
    *   [filename](#filename)
    *   [isExistent](#isexistent)
    *   [isEmpty](#isempty)
    *   [readStream](#readstream)
    *   [writeStream](#writestream)
    *   [getReadStream](#getreadstream)
        *   [Parameters](#parameters-1)
    *   [getWriteStream](#getwritestream)
        *   [Parameters](#parameters-2)## FileSystemEntry**Extends StreamContentEntryMixin(ContentEntry)**A ContentEntry backed by a file.### Parameters*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the file
*   `baseDir` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** directory the file is located in### Properties*   `name` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** of the file
*   `baseDir` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** directory the file is located in### filenameAbsolute file path.Returns **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** ### isExistentCheck for presence of the entry.Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)>** ### isEmptyCheck is entry represents an empty file.Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)<[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)>** ### readStreamReturns **Readable** ### writeStreamReturns **Writable** ### getReadStream#### Parameters*   `options` &#x20;**Meta***   **deprecated**: This is deprecated.### getWriteStream#### Parameters*   `options` &#x20;**Meta***   **deprecated**: This is deprecated.# installWith [npm](http://npmjs.org) do:```shell
npm install content-entry-filesystem
```# licenseBSD-2-Clause
