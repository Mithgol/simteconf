This module is a synchronous reader of **sim**ple **te**xt **conf**iguration files. It is called **simteconf**.

It is written in JavaScript for Node.js version 0.10 or newer.

The project has just started and is not in a complete state.

# Installing simteconf

[![(npm package version)](https://badge.fury.io/js/simteconf.png)](https://npmjs.org/package/simteconf)

* Latest packaged version: `npm install simteconf`

* Latest githubbed version: `npm install https://github.com/Mithgol/simteconf/tarball/master`

You may visit https://github.com/Mithgol/simteconf#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (However, `npm publish --force` may happen eventually.)

# Simple text configuration files

A simple text configuration file is a text file containing (on each of its lines) a name and a value, separated by one (or more) spaces.

Example:

```
UserName John Smith
DispStatusLine Yes
Tagline Take care of the John Smith who will shake up the world!
Tagline Behold, I have created the smith that bloweth the coals in the fire
Tagline We have an unusual problem here, Jane.
```

There is always a possibility of repeating values. Sometimes intentional, like taglines in the above example. Sometimes accidental, but then the program's designer should at least make a conscious decision to take the first or the last value if it uses only one.

# Using simteconf

Require the installed module and use it to read your configuration. Continuing the example given above,

```js
var simteconf = require('simteconf');
var config = simteconf('config.txt', {
   skipEmpty: false
});
var username = config.last('username'); // "John Smith"
var needStatus = config.last('DispStatusLine'); // "Yes"
var taglines = config.all('tagline'); // array of taglines
```

## API

### simteconf(filename, options)

The constructor takes a **filename** of the configuration file and an object of **options**. The latter are:

* `EOL` — line separator of the file. **By default,** [`os.EOL`](http://nodejs.org/docs/latest/api/os.html#os_os_eol) is used.

* `skipEmpty` — if `false`, empty values are possible for some configuration names (for example, if a name is followed only with spaces on the same line). **By default,** `true` (such lines are ignored).

* `lowercase` — if `true`, the names are processed with [`.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase) when reading from the file **and** when using the methods such as `.last(name)`. The names become case-insensitive. **By default,** `true`.

The constructor returns an object with the following methods:

### last(name)

If one or more configuration lines have had the **name**, returns the value from the last of such lines.

If the name has never been used in the configuration, `null` is returned.

### first(name)

If one or more configuration lines have had the **name**, returns the value from the first of such lines.

If the name has never been used in the configuration, `null` is returned.

### all(name)

If one or more configuration lines have had the **name**, returns the array of values from such lines (in order of appearance).

If the name has never been used in the configuration, `null` is returned.

# Testing simteconf

[![(build testing status)](https://travis-ci.org/Mithgol/simteconf.png?branch=master)](https://travis-ci.org/Mithgol/simteconf)

It is necessary to install [Mocha](http://visionmedia.github.io/mocha/) for testing.

You may install Mocha globally (`npm install mocha -g`) or locally (`npm install mocha` in the directory of `simteconf`).

After that you may run `npm test` (in the directory of `simteconf`) for testing.

# License

MIT License, see the `LICENSE` file.
