# Sugar-Deprecated

[![Build Status](https://travis-ci.org/Slayer95/sugar-deprecated.svg)](https://travis-ci.org/Slayer95/sugar-deprecated.svg)

Compatibility layer to smoothly remove dependency on the library [Sugar.js][1]

I have nothing against said library, but I found myself in the need to remove it from a project.

This solution deprecates Sugar.js extensions, but they still work should you forget to remove any of them.
Optionally, warns will be emitted whenever such calls are unexpectedly performed.

  [1]: https://github.com/andrewplummer/Sugar

## Installation

```javascript
npm install --save sugar-deprecated
```

## Usage

Add to the very top of the application.

```javascript
require('sugar-deprecated')(fn); // Pass a logger function to convenience.
```

## License

MIT License
