import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { build } from "vite";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));

test("production HTML contains the home screen before JavaScript executes", async () => {
  const outDir = await mkdtemp(path.join(tmpdir(), "hflive-static-home-"));

  try {
    await build({
      root: projectRoot,
      logLevel: "silent",
      build: {
        outDir,
        emptyOutDir: true,
      },
    });

    const html = await readFile(path.join(outDir, "index.html"), "utf8");
    assert.match(
      html,
      /<div id="app">\s*<main class="screen home-screen" data-screen="home">/,
      "the app container should contain the home screen",
    );
    assert.match(
      html,
      /<script type="module"/,
      "the client entry should remain a deferred module script",
    );
  } finally {
    await rm(outDir, { recursive: true, force: true });
  }
});
