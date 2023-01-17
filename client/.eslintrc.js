module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "airbnb-base",
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    quotes: ["error", "double"],
    "linebreak-style": ["error", (process.platform === "win32" ? "windows" : "unix")],
    "no-use-before-define": ["error", {
      functions: false,
    }],
    "no-plusplus": ["error", {
      allowForLoopAfterthoughts: true,
    }],
  },
};
