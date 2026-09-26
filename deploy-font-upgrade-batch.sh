#!/bin/bash
set -e

export DEVELOPER_DIR=/Library/Developer/CommandLineTools
export PATH=/Users/gmane/.local/bin:/Library/Developer/CommandLineTools/usr/bin:$PATH

BASE_DIR="/Users/gmane/Documents/ZoMae Media LLC/Aura & Grid"
cd "$BASE_DIR"

SLUGS=("$@")

for slug in "${SLUGS[@]}"; do
  APP_DIR="$BASE_DIR/Website Templates/$slug"
  if [ ! -d "$APP_DIR" ]; then
    echo "Directory not found: $APP_DIR"
    continue
  fi

  echo "=================================================="
  echo "🚀 DEPLOYING 18PX GLOBAL FONT UPGRADE: $slug"
  echo "=================================================="

  cd "$APP_DIR"

  # 1. Inject global font-size: 18px into index.html
  node -e '
  const fs = require("fs");
  if (fs.existsSync("index.html")) {
    let html = fs.readFileSync("index.html", "utf8");
    if (!html.includes("html { font-size: 18px !important; }")) {
      const styleBlock = `    <style>\n      html { font-size: 18px !important; }\n      body { font-size: 1.125rem !important; line-height: 1.65 !important; }\n    </style>\n  </head>`;
      if (html.includes("</head>")) {
        html = html.replace("</head>", styleBlock);
      }
      fs.writeFileSync("index.html", html);
      console.log("Injected 18px root style into index.html");
    }
  }
  '

  # 2. Build production assets
  npm run build || continue

  # 3. Commit to main
  git add index.html src/ dist/ 2>/dev/null || true
  git commit -m "style: global 18px font-size scale and high-contrast accessibility upgrade" 2>/dev/null || true
  git push origin main 2>/dev/null || true

  # 4. If gh-pages branch exists or repo has gh-pages, deploy cleanly
  if git rev-parse --verify origin/gh-pages >/dev/null 2>&1 || [ -f "dist/index.html" ]; then
    TMP_PAGES="/tmp/gh-pages-$slug"
    rm -rf "$TMP_PAGES"
    mkdir -p "$TMP_PAGES"
    cp -R dist/* "$TMP_PAGES/"
    touch "$TMP_PAGES/.nojekyll"

    git checkout --orphan gh-pages-temp 2>/dev/null || true
    git rm -rf . 2>/dev/null || true
    cp -R "$TMP_PAGES"/* . 2>/dev/null || true
    touch .nojekyll
    git add -A 2>/dev/null || true
    git commit -m "deploy: global 18px font-size scale to gh-pages" 2>/dev/null || true
    git branch -D gh-pages 2>/dev/null || true
    git branch -m gh-pages
    git push -f origin gh-pages 2>/dev/null || true
    git checkout main 2>/dev/null || true
    git branch -D gh-pages-temp 2>/dev/null || true
    rm -rf "$TMP_PAGES"
    echo "✓ Live gh-pages updated for $slug"
  fi

  # 5. Update dist zip crate
  DIST_DIR="$BASE_DIR/dist/$slug"
  mkdir -p "$DIST_DIR"
  cd "$BASE_DIR/Website Templates"
  rm -f "$DIST_DIR/$slug-v1.0.0.zip"
  zip -rq "$DIST_DIR/$slug-v1.0.0.zip" "$slug" -x "$slug/node_modules/*" -x "$slug/.git/*" -x "$slug/dist/*"
  echo "✓ Crated $DIST_DIR/$slug-v1.0.0.zip"
done

echo "Batch complete!"
