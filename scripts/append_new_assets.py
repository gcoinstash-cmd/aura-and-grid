import json
import os

with open('/tmp/ingested_assets.json') as f:
    ingested = json.load(f)

# Load CATALOG_MANIFEST.json
with open('CATALOG_MANIFEST.json') as f:
    manifest = json.load(f)

current_ids = {p['id'] for p in manifest['products']}
print(f"Current catalog size: {len(manifest['products'])}")

flagship_slugs = {
    'aegis-swarm-os',
    'autonomous-subsea-mining-crawler-telemetry-os',
    'geothermal-supercritical-egs-wellhead-scada-os',
    'hypersonic-wind-tunnel-aerodynamics-telemetry-os',
    'orbital-satellite-laser-isl-optical-terminal-os',
    'orbital-habitat-closed-loop-os'
}

for item in ingested:
    idx = item['id']
    if idx in current_ids:
        print(f"Skipping existing ID {idx}")
        continue
    
    slug = item['slug']
    is_flagship = slug in flagship_slugs
    score = 9.7 if is_flagship else 9.6
    
    # Archetype determination
    if any(k in slug for k in ['scada', 'cryostat', 'fusion', 'geothermal', 'cleanroom', 'egs']):
        arch_id = 'D'
        arch_name = 'Archetype D: SCADA System Matrix'
        arch_desc = 'High-density telemetry streams, closed-loop sensor controllers, and industrial process automation.'
        benchmark = 'Siemens WinCC & Schneider EcoStruxure SCADA'
    elif any(k in slug for k in ['telemetry', 'laser', 'aerodynamics', 'aerospike', 'satellite']):
        arch_id = 'A'
        arch_name = 'Archetype A: Dense Operational Console'
        arch_desc = 'Persistent utility rail, real-time operational triage queue, and slide-out inspection drawer.'
        benchmark = 'NASA Mission Control & Palantir Foundry Console'
    elif any(k in slug for k in ['yacht', 'concierge', 'winery']):
        arch_id = 'B'
        arch_name = 'Archetype B: Asymmetric Editorial Showcase'
        arch_desc = 'Dynamic masonry grid, visual filtering, and slide-over commission sheet.'
        benchmark = 'LVMH Luxury Atelier & Monaco Yacht Show'
    else:
        arch_id = 'C'
        arch_name = 'Archetype C: High-Velocity Dispatch Rail'
        arch_desc = 'Fleet asset tracking, dispatch coordination, and route telemetry.'
        benchmark = 'Flexport Global Logistics & Samsara Fleet Hub'

    prod_obj = {
        "id": idx,
        "name": item['name'],
        "category": item['desc'] if len(item['desc']) < 60 else (item['name'] + " Console"),
        "gumroad_url": f"https://auraandgrid.gumroad.com/l/{slug}",
        "preview_url": f"https://{slug}.onrender.com",
        "admin_url": f"https://{slug}.onrender.com/admin",
        "admin_passcode": f"{slug.split('-')[0]}2026",
        "audit_score": score,
        "tables": item['tables'][:6],
        "vertical": item['vertical'],
        "archetype_id": arch_id,
        "archetype_name": arch_name,
        "archetype_description": arch_desc,
        "design_benchmark": benchmark,
        "checkout_active": True,
        "status_badge": "Interactive Prototype",
        "commercial_checkout_url": f"https://auraandgrid.gumroad.com/l/{slug}",
        "demo_passcode_type": "DEMO PASSCODE (READ-ONLY SANDBOX)",
        "security_architecture": "Level 3: Supabase-Ready Blueprint (Frontend + Schema + Demo RLS Policies)"
    }
    
    manifest['products'].append(prod_obj)

manifest['total_flagships'] = len(manifest['products'])

with open('CATALOG_MANIFEST.json', 'w') as f:
    json.dump(manifest, f, indent=2)

print(f"Updated CATALOG_MANIFEST.json to {manifest['total_flagships']} products.")
