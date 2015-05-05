# grunt-graphics

[![Build Status](https://travis-ci.org/gabrielbull/grunt-graphics.svg)](https://travis-ci.org/gabrielbull/grunt-graphics)

## Getting Started

Example config

```js
grunt.initConfig({
    graphics: {
        assets: {
            src: "assets/**/*"
        }
    }
});
```

Example file in assets directory

File `assets/images.js`:

```js
module.exports = [
    {
        options: [
            {suffix: '@1x', width: 768},
            {suffix: '@2x', width: (768 * 2)},
            {suffix: '@3x', width: (768 * 3)}
        ],
        files: {
            "dist/images/image-output.png": "src/image-source.psd"
        }
    }
];
```
