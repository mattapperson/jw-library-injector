module.exports = function (wallaby) {
  const tsConfig = require('./tsconfig.json');


  const contractPathExp = 'src/**/*.contract.ts?(x)';
  const testPathExp = 'src/**/*.spec.ts?(x)';

  const JScontractPathExp = 'src/**/*.contract.js?(x)';
  const JStestPathExp = 'src/**/*.spec.js?(x)';

  return {
    files: [
      'tsconfig.json',
      'config/jest/*.js',
      'src/**/*.+(js|jsx|ts|tsx|json|snap|css|less|sass|scss|jpg|jpeg|gif|png|svg)',
      `!${contractPathExp}`,
      `!${testPathExp}`,
      `!${JScontractPathExp}`,
      `!${JStestPathExp}`,
    ],

    tests: [
      testPathExp,
      contractPathExp,
      JScontractPathExp,
      JStestPathExp
    ],
    env: {
      type: 'node',
      runner: 'node'
    },
    testFramework: 'jest',
    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel({
        babel: require('babel-core'),
        presets: ["react"],
        plugins: [
          "transform-class-properties",
          "transform-object-rest-spread",
        ]
      }),
      '**/*.ts?(x)': wallaby.compilers.typeScript(tsConfig.compilerOptions),
    },
    setup: function (wallaby) {
      var jestConfig = require('./package.json').jest;
      // for example:
      // jestConfig.globals = { "__DEV__": true };
      wallaby.testFramework.configure(jestConfig);
    }
  };
};