module.exports = function (api) {
  api.cache(true);
  return {
    plugins: [
      ['transform-define', {
        'NODE_ENV': process.env.NODE_ENV,
      }]
    ]
  };
};
