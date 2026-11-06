import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Mount/hidratsiya effektlarida setState qasddan ishlatiladi
      // (localStorage o'qish, mounted-gate) — bu standart Next naqsh.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "warn",
      // O'zbekcha matnda apostrof (o') hamma joyda — escaping o'qishni qiyinlashtiradi.
      "react/no-unescaped-entities": "off",
      // "// LABEL" — terminal-uslub UI yorliqlari (qasddan).
      "react/jsx-no-comment-textnodes": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
