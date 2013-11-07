This module is a synchronous reader of **sim**ple **te**xt **conf**iguration files. It is called **simteconf**.

It is written in JavaScript for Node.js version 0.10 or newer.

# Installing simteconf

[![(npm package version)](https://badge.fury.io/js/simteconf.png)](https://npmjs.org/package/simteconf)

* Latest packaged version: `npm install simteconf`

* Latest githubbed version: `npm install https://github.com/Mithgol/simteconf/tarball/master`

You may visit https://github.com/Mithgol/simteconf#readme occasionally to read the latest `README` because the package's version is not planned to grow after changes when they happen in `README` only. (However, `npm publish --force` may happen eventually.)

# Simple text configuration files

A simple text configuration file is a text file containing (on each of its lines) a name and a value, separated by one (or more) spaces.

Example:

```
# A name and a setting.
UserName John Smith
DispStatusLine Yes

// A set of taglines.
Tagline Take care of the John Smith who will shake up the world!
Tagline Behold, I have created the smith that bloweth the coals in the fire
Tagline We have an unusual problem here, Jane.
```

Lines can be blank (or can contain only some whitespace). Such lines are ignored.

There is always a possibility of several values of the same name. Sometimes intentional, like taglines in the above example. Sometimes accidental, but then the program's designer should at least make a conscious decision to take the first or the last value if it uses only one.

The meaning of a named line in a simple configuration file does not depend on the presence or the order of lines that have different names.

A couple of examples in the existing Fidonet software:

* [BinkD](http://binkd.grumbler.org/) configuration is a simple text configuration.

* Echomail area configuration of [HPT](http://husky.sourceforge.net/hpt.html) is (usually) a simple text configuration file, though it becomes complex (and cannot be parsed by simteconf) if its author uses any of the following:
   * changing defaults in the middle of the file,
   * conditional sections,
   * using (and especially redefining) environment variables.

These two programs themselves do not (obviously) use simteconf, but a simteconf-using script may analyze their configuration files.

## Groups of options

Sometimes configuration options are organized in a simple hierarchy (one level deep), i.e. there are groups of options.

In the most simple case, the configuration lines of such group is prefixed with the group's name.

For example, in the following lines of [HPT](http://husky.sourceforge.net/hpt.html)'s echomail area configuration, `LocalArea` or `EchoArea` is the prefix, the echomail area's name (`R50...`) is an option's name and the rest of the line is that option's value:

```
LocalArea Carbon.Copies  \FIDO\MAIL\JAM\Carbons...
LocalArea FGHIGet        \FIDO\MAIL\FGHIGet...

EchoArea R50.Bone        \FIDO\MAIL\JAM\R50_Bone...
EchoArea R50.Elections   \FIDO\MAIL\JAM\R50Elect...
EchoArea R50.Hubs        \FIDO\MAIL\JAM\R50_Hubs...
EchoArea R50.SysOp       \FIDO\MAIL\JAM\R50Sysop...
EchoArea R50.SysOp.Club  \FIDO\MAIL\JAM\R50SysCl...
EchoArea R50.SysOp.Info  \FIDO\MAIL\JAM\R50SysIn...
EchoArea R50.SysOp.Talk  \FIDO\MAIL\JAM\R50SysTa...
```

For another example, that's how a [GoldED+](http://golded-plus.sourceforge.net/) sounds for several events may be defined in the configuration:

```
Event Arealist       Play matrix_wow.wav
Event AskYesNo       Play matrix_what_is_the.wav
Event Attention      Play Enterprise.wav
Event DosShell       Play matrix_bullet.wav
Event EditComment    Play detected.wav
Event EditCompletion Play xp_notify.wav
Event EndOfMsgs      Play barrier.wav
Event ErrorFatal     Play SOS
Event Exit           Play goodbye_lord.wav
Event JobDone        Play Sound45.wav
Event JobFailed      Play TheEnd
Event MsgDeleting    Play matrix_shmyack.wav
Event MsgFromYou     Play online.wav
Event MsgIsLocal     Play wirr.wav
Event MsgIsTwit      Play Sound7.wav
Event MsgToYou       Play incoming.wav
Event SearchFailed   Play matrix_wow.wav
Event SearchSuccess  Play search_finished.wav
Event Startup        Play DeathNote.wav
```

In this example, `Event` is the group's name. The individual options' names are `Arealist`, `AskYesNo`, `Attention`, `DosShell`, `EditComment`, `EditCompletion`, `EndOfMsgs`, `ErrorFatal`, `Exit`, `JobDone`, `JobFailed`, `MsgDeleting`, `MsgFromYou`, `MsgIsLocal`, `MsgIsTwit`, `MsgToYou`, `SearchFailed`, `SearchSuccess`, `Startup`. The rest is the options' values.

# Using simteconf

Require the installed module and use it to read your configuration. Continuing the first of the examples given above,

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

* `lowercase` — if `true`, the names are processed with [`.toLowerCase()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toLowerCase) when reading from the file **and** when using the methods such as `.last(name)` or `.group(name)`. The names become case-insensitive. **By default,** `true`. Does also affect the contents of `skipNames` and `prefixGroups` (see below).

* `skipNames` — if contains an array of strings, then a line is ignored if its name starts with one of these strings. **By default,** `false` (each named line is remembered by simteconf). Know the following details:
   * A comment (such as `# comment` or `// comment`) is also treated as a named line of the configuration file (with `#` or `//` in the line's name). You may pass `skipNames: ['#', '//']` to prevent simteconf from remembering comments.
   * However, a named line which is never used later (in the parent program that called the simteconf module) also becomes ignored. (If its name is unknown, any named line's behaviour is the same.) By passing `skipNames` array you merely reduce the memory footprint of simteconf.
   * It is not (currently) possible to pass an exhaustive list of known names to simteconf and to trade forward compatibility for error reporting.

* `prefixGroups` — if contains an array of strings, these strings are treated as the names of configuration groups that precede options belonging to a group. (In the above examples, `['LocalArea', 'EchoArea']` for HPT's area configuration, `['Event']` for GoldED+ events.)

The constructor returns the top level configuration object that has the following method:

### group(name)

Returns a group of configuration lines.

The group has to be previously defined by the `prefixGroup` in the constructor's options **and** has to actually exist in the configuration. Otherwise an empty group is returned, i.e. the accessing methods (`.last`, `.first`, `.all`, `.random`) return `null`.

### Accessing configuration lines

These methods can be used both in the configuration's object (to access top-level configuration lines) and in a group's object (to access the lines within that group):

#### last(name)

If one or more configuration lines have had the **name**, returns the value from the last of such lines.

If the name has never been used in the configuration (of the top level or the group where the method is called), `null` is returned.

#### first(name)

If one or more configuration lines have had the **name**, returns the value from the first of such lines.

If the name has never been used in the configuration (of the top level or the group where the method is called), `null` is returned.

#### all(name)

If one or more configuration lines have had the **name**, returns the array of values from such lines (in order of appearance).

If the name has never been used in the configuration (of the top level or the group where the method is called), `null` is returned.

#### random(name)

If one or more configuration lines have had the **name**, returns the value from a randomly chosen one of such lines.

If the name has never been used in the configuration (of the top level or the group where the method is called), `null` is returned.

# Testing simteconf

[![(build testing status)](https://travis-ci.org/Mithgol/simteconf.png?branch=master)](https://travis-ci.org/Mithgol/simteconf)

It is necessary to install [Mocha](http://visionmedia.github.io/mocha/) and [JSHint](http://jshint.com/) for testing.

* You may install Mocha globally (`npm install mocha -g`) or locally (`npm install mocha` in the directory of `simteconf`).

* You may install JSHint globally (`npm install jshint -g`) or locally (`npm install jshint` in the directory of `simteconf`).

After that you may run `npm test` (in the directory of `simteconf`) for testing.

# License

MIT License, see the `LICENSE` file.

The tests use three [proper nouns](http://en.wikipedia.org/wiki/Proper_noun) and three verses from “[Puella Magi](https://wiki.puella-magi.net/)” series. Such small excerpts are widely believed to qualify as fair use.