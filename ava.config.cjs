module.exports = {
  extensions: ['ts'],
  nodeArguments: [
    '--loader=ts-node/esm',
    '--experimental-specifier-resolution=node'
  ],
  files: ['src/**/*.test.ts']
};
