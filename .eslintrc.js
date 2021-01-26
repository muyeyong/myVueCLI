module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ["plugin:vue/essential", "airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: 12,
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        moduleDirectory: ["node_modules", "src/"]
      },
      alias: {
        map: [["components", "./src/components"]],
        extensions: [".js", ".vue"]
      }
    }
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never"
      }
    ]
  }
}
