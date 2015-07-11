module.exports = [
    {
        options: [
            {suffix: '@1x', width: 768},
            {suffix: '@2x', width: (768 * 2)},
            {suffix: '@3x', width: (768 * 3)}
        ],
        files: {
            ".tmp/png.png": "test/fixtures/images/png.png"
        }
    }
];
