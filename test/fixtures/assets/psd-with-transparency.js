module.exports = [
    {
        options: [
            {suffix: '@1x', width: 768},
            {suffix: '@2x', width: (768 * 2)},
            {suffix: '@3x', width: (768 * 3)}
        ],
        files: {
            ".tmp/psd-with-transparency.png": "test/fixtures/images/psd-with-transparency.psd"
        }
    },
    {
        options: [
            {suffix: '@1x', width: 768},
            {suffix: '@2x', width: (768 * 2)},
            {suffix: '@3x', width: (768 * 3)}
        ],
        processor: 'gimp',
        files: {
            ".tmp/psd-with-transparency-gimp.png": "test/fixtures/images/psd-with-transparency.psd"
        }
    }
];
