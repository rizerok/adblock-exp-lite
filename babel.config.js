module.exports = function (api) {
  api.cache(true);
  const presets = process.env.NODE_ENV === 'production' ? ['minify'] : [];
  return {
    presets,
    plugins: [
      ['transform-define', {
        'NODE_ENV': process.env.NODE_ENV,
      }]
    ]
  };
};
