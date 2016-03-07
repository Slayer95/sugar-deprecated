# Sugar-Deprecated

Compatibility layer to smoothly remove dependency on library [Sugar.js][1]

I have nothing against said library, but I found myself in the need to remove it from a project,
and this is the solution I came up with.

It deprecates Sugar.js extensions, but they still work should you forget to remove their usage.
You will optionally be warned whenever such calls are unexpectedly performed.

  [1]: https://github.com/andrewplummer/Sugar

## Installation

npm install --save sugar-deprecated

## Usage

Add to the very top of the application.

```javascript
require('sugar-deprecated')(fn); // Pass a logger function to convenience.
```

## License

MIT License
