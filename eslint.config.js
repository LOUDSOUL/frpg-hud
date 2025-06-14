import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";


export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
        "$": "readonly",
        "myApp": "readonly",
        "luxon": "readonly",
        "unsafeWindow": "readonly",
        "GM_getValue": "readonly",
        "GM_setValue": "readonly",
        "GM_addStyle": "readonly",
        "GM_setClipboard": "readonly",
        "GM_addValueChangeListener": "readonly",
      }
    },
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["vite.config.js"],
    languageOptions: {
      globals: globals.node,
    },
  }
]);
