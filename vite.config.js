import { defineConfig } from "vite";

import { renderHome } from "./src/modules/home-template.js";

const appOutlet = '<div id="app"></div>';

export default defineConfig({
  plugins: [
    {
      name: "hflive-static-home",
      transformIndexHtml(html) {
        if (!html.includes(appOutlet)) {
          throw new Error(`Missing static home outlet: ${appOutlet}`);
        }

        return html.replace(
          appOutlet,
          `<div id="app">${renderHome()}</div>`,
        );
      },
    },
  ],
});
