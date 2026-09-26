import os
import re

templates_dir = "Website Templates"
broken_reports = []

for folder in sorted(os.listdir(templates_dir)):
    folder_path = os.path.join(templates_dir, folder)
    if not os.path.isdir(folder_path) or folder in ["Archive & Legacy Templates", "node_modules"]:
        continue
    
    app_file = os.path.join(folder_path, "src", "App.tsx")
    if not os.path.exists(app_file):
        app_file = os.path.join(folder_path, "src", "App.jsx")
        if not os.path.exists(app_file):
            continue

    with open(app_file, "r", errors="ignore") as f:
        content = f.read()

    hrefs = set(re.findall(r'href=["\']#([a-zA-Z0-9_-]+)["\']', content))
    ids = set(re.findall(r'id=["\']([a-zA-Z0-9_-]+)["\']', content))

    missing = hrefs - ids
    if missing:
        broken_reports.append((folder, list(missing)))

print(f"Total templates with missing anchor IDs: {len(broken_reports)}")
for folder, missing in broken_reports:
    print(f"  {folder}: missing {missing}")
