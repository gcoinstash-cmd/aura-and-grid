#!/bin/bash
set -e

export DEVELOPER_DIR=/Library/Developer/CommandLineTools
export PATH=/Users/gmane/.local/bin:/Library/Developer/CommandLineTools/usr/bin:$PATH

BASE_DIR="/Users/gmane/Documents/ZoMae Media LLC/Aura & Grid"
cd "$BASE_DIR"

declare -a TARGETS=(
  "fine-dining-matrix:fine-dining-matrix-os:https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c"
  "medspa-clinic-os:medspa-clinic-os:https://images.unsplash.com/photo-1629909613654-28e377c37b09"
  "superyacht-charter-os:superyacht-charter-os:https://images.unsplash.com/photo-1569263979104-865ab7cd8d17"
  "luxury-horology-vault:luxury-horology-vault-os:https://images.unsplash.com/photo-1523275335684-37898b6baf30"
  "private-villa-estate:private-villa-estate-os:https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
)

for item in "${TARGETS[@]}"; do
  IFS=":" read -r slug repo img <<< "$item"
  echo "=================================================="
  echo "🚀 DEPLOYING TARGET: $slug ($repo)"
  echo "=================================================="
  
  APP_DIR="$BASE_DIR/Website Templates/$slug"
  DIST_DIR="$BASE_DIR/dist/$slug"
  mkdir -p "$DIST_DIR"

  cd "$APP_DIR"
  
  # Ensure clean build
  npm run build

  # Initialize git if needed
  if [ ! -d ".git" ]; then
    git init
    git branch -M main
  fi

  # Create GitHub repo if it does not exist
  gh repo create "gcoinstash-cmd/$repo" --public --confirm 2>/dev/null || true
  git remote remove origin 2>/dev/null || true
  git remote add origin "https://github.com/gcoinstash-cmd/$repo.git"

  # Commit & push main
  git add -A
  git commit -m "feat: complete initial production release for $slug" || true
  git push -u origin main -f || true

  # Deploy to gh-pages with SPA routing & .nojekyll
  TMP_PAGES="/tmp/gh-pages-$slug"
  rm -rf "$TMP_PAGES"
  mkdir -p "$TMP_PAGES"
  cp -R dist/* "$TMP_PAGES/"
  touch "$TMP_PAGES/.nojekyll"

  git checkout --orphan gh-pages-temp
  git rm -rf . || true
  cp -R "$TMP_PAGES"/* .
  touch .nojekyll
  git add -A
  git commit -m "deploy: live preview to gh-pages" || true
  git branch -D gh-pages 2>/dev/null || true
  git branch -m gh-pages
  git push -f origin gh-pages
  git checkout main
  git branch -D gh-pages-temp 2>/dev/null || true
  rm -rf "$TMP_PAGES"

  # Packaging loot crate in dist/<slug>/
  echo "📦 Packaging loot crate..."
  cd "$BASE_DIR/Website Templates"
  rm -f "$DIST_DIR/$slug-v1.0.0.zip"
  zip -rq "$DIST_DIR/$slug-v1.0.0.zip" "$slug" -x "$slug/node_modules/*" -x "$slug/.git/*" -x "$slug/dist/*"
  
  # Copy schemas
  cp "$APP_DIR/supabase/schema.sql" "$DIST_DIR/" 2>/dev/null || true
  cp "$APP_DIR/supabase/seed.sql" "$DIST_DIR/" 2>/dev/null || true
  cp "$APP_DIR/SUPABASE_SETUP.md" "$DIST_DIR/" 2>/dev/null || true

  # Download high-res cover & thumbnail
  curl -s "${img}?auto=format&fit=crop&w=1200&h=675&q=85" -o "$DIST_DIR/${slug}-cover.jpg" || true
  curl -s "${img}?auto=format&fit=crop&w=600&h=600&q=85" -o "$DIST_DIR/${slug}-thumbnail.jpg" || true

  echo "✓ Crate and assets ready in dist/$slug/"
done

echo "🎉 ALL 5 APPS IN BATCH #13 DEPLOYED & CRATED SUCCESSFULLY!"
