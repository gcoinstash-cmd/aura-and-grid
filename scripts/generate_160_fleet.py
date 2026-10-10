#!/usr/bin/env python3
"""
Generate the consolidated 160-unit fleet dataset across:
- data/fleet.json
- src/data/fleet.json
- tools/ghost-factory-console/src/data/fleet.json

Composition (160 units):
- 86 Track 1 Lean Rapid-Sale units (85 units #1-#85 + unit #112)
- 51 Track 2 Hypercar Flagships (50 units #86-#136 excl #112 + unit #137)
- 23 Track 3 F1 Skunkworks Service Engines (units #138-#160: T3-NEXUS-01 through GF-T3-159)
"""

import json
import os

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANIFEST_PATH = os.path.join(ROOT_DIR, "CATALOG_MANIFEST.json")
FLEET_SRC_PATH = os.path.join(ROOT_DIR, "data", "fleet.json")

with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
    manifest = json.load(f)

with open(FLEET_SRC_PATH, "r", encoding="utf-8") as f:
    base_fleet = json.load(f)

# Ensure base fleet (136 items) has proper category badges
def get_badge(item):
    name = (item.get("name", "")).lower()
    cat = (item.get("category", "")).lower()
    vert = (item.get("vertical", "")).lower()
    dom = (item.get("domain", "")).lower()

    if any(k in name or k in cat or k in vert or k in dom for k in ["fintech", "quant", "wealth", "finance", "credit", "arbitrage", "margin", "orderbook", "matching"]):
        return "FinTech"
    if any(k in name or k in cat or k in vert or k in dom for k in ["swarm", "multi-agent", "voronoi", "flocking", "consensus", "edge ai"]):
        return "Edge AI"
    if any(k in name or k in cat or k in vert or k in dom for k in ["zero-trust", "cyber", "cryptograph", "sovereign", "dvp", "lattice"]):
        return "Zero-Trust"
    if any(k in name or k in cat or k in vert or k in dom for k in ["telemetry", "aerospace", "scada", "avionics", "guidance", "orbit", "flight", "cbf", "deconfliction", "sonar", "tokamak", "rcs", "subsea", "automotive"]):
        return "Telemetry"
    return "Showroom"

for item in base_fleet:
    item["category_badge"] = get_badge(item)

fleet_160 = list(base_fleet)

# Unit 137: Track 2 Flagship #51
unit_137 = {
    "id": 137,
    "name": "Deep-Sea Trench Bathymetric Sonar SCADA OS",
    "category": "Autonomous High-Resolution Bathymetric Sonar & Subsea Trench Mapping SCADA OS",
    "gumroad_url": "https://auraandgrid.gumroad.com/l/deep-sea-trench-bathymetric-sonar-scada-os",
    "preview_url": "https://deep-sea-bathymetric-sonar-scada.onrender.com",
    "admin_url": "https://deep-sea-bathymetric-sonar-scada.onrender.com/admin",
    "audit_score": 9.9,
    "tables": [
        "bathymetric_soundings",
        "sonar_beam_matrices",
        "subsea_crawler_telemetry",
        "trench_depth_profiles",
        "acoustic_transponder_nodes"
    ],
    "vertical": "subsea",
    "archetype_id": "A",
    "archetype_name": "Archetype A: Dense Operational Console",
    "archetype_description": "Persistent utility rail, simulated operational triage queue, and slide-out inspection drawer.",
    "design_benchmark": "Kongsberg Maritime HiPAP & NOAA Okeanos Subsea Mapping SCADA",
    "checkout_active": True,
    "status_badge": "Flagship Interactive Prototype",
    "commercial_checkout_url": "https://auraandgrid.gumroad.com/l/deep-sea-trench-bathymetric-sonar-scada-os",
    "demo_passcode_type": "DEMO PASSCODE (READ-ONLY SANDBOX)",
    "security_architecture": "Level 3: SCADA/Subsea Blueprint (Frontend + Schema + Demo RLS Policies)",
    "pricing_track": "Track 2 — Flagship Tier-1 ($14,500 Anchor)",
    "flagship_qualified": True,
    "flagship_license_msrp": 1500,
    "flagship_license_range": [1500, 3500],
    "exclusive_buyout_anchor": 14500,
    "exclusive_buyout_range": [10000, 18000],
    "full_asset_buyout_range": [18000, 35000],
    "strategic_acquisition_range": [35000, 75000],
    "truth_label": "Interactive Prototype (Simulated Data Only) — Concept Demo",
    "truth_badge": "Interactive Prototype // Simulated Data Only",
    "disclaimer": "SIMULATED DATA PROTOTYPE — NOT CERTIFIED FOR MARITIME NAVIGATION, SUBMERSIBLE PILOTING, OR LIFE-CRITICAL SUBSEA USE",
    "best_for": "Best for: Autonomous underwater vehicle operators, oceanic bathymetry hydrographers & subsea survey teams",
    "domain": "Industrial Robotics & Autonomous SCADA",
    "rarity_tier": "Elite",
    "permanent": True,
    "buyoutEligible": False,
    "complianceStandard": "NIST-SP-800-218",
    "category_badge": "Telemetry"
}
fleet_160.append(unit_137)

# Track 3 Engines (23 units: IDs 138 through 160)
t3_engines_meta = manifest.get("track3_engines", [])

badge_map = {
    "fintech_quant": "FinTech",
    "FinTech/Quant": "FinTech",
    "Zero-Trust Cyber": "Zero-Trust",
    "Autonomous Telemetry": "Telemetry",
    "Autonomous Guidance / Mesh": "Telemetry",
    "Autonomous Telemetry / Cockpit": "Telemetry",
    "Edge AI Swarms": "Edge AI",
}

for idx, eng in enumerate(t3_engines_meta):
    unit_id = 138 + idx
    raw_vert = eng.get("vertical_assignment") or eng.get("vertical") or ""
    cat_badge = "Telemetry"
    for k, v in badge_map.items():
        if k.lower() in raw_vert.lower():
            cat_badge = v
            break

    unit_item = {
        "id": unit_id,
        "tag": eng.get("id"),
        "name": eng.get("name"),
        "category": eng.get("category"),
        "vertical": raw_vert,
        "category_badge": cat_badge,
        "pricing_track": "Track 3 — F1 Skunkworks Engine",
        "rarity_tier": "Elite",
        "audit_score": 9.9,
        "tables": ["state_frames", "telemetry_records", "execution_logs", "audit_trail"],
        "checkout_active": False,
        "status_badge": "Track 3 Working Service Engine",
        "truth_badge": eng.get("truth_badge") or "Working Service Engine // Clean-Room Permissive",
        "disclaimer": eng.get("disclaimer") or "IN-MEMORY HIGH-PERFORMANCE ENGINE — SIMULATED TELEMETRY FEEDS — NOT A PRODUCTION SAAS",
        "best_for": f"Best for: Enterprise systems engineers and quant developers deploying {eng.get('name')}",
        "domain": cat_badge,
        "buyoutEligible": True,
        "permanent": False,
        "preview_url": f"http://localhost:5173/t3/{eng.get('id', '').lower()}",
        "admin_url": f"http://localhost:5173/t3/{eng.get('id', '').lower()}/docs",
        "gumroad_url": "https://auraandgrid.gumroad.com",
        "commercial_checkout_url": "https://auraandgrid.gumroad.com",
        "license": eng.get("license", "Apache-2.0 / MIT Dual Permissive"),
        "apa_buyout_floor": eng.get("baseline_trim_apa_floor") or eng.get("apa_buyout_floor") or 35000,
        "monopoly_ceiling": eng.get("monopoly_vault_buyout") or eng.get("vault_buyout_planning_value") or 85000,
    }
    fleet_160.append(unit_item)

print(f"Total units in generated fleet: {len(fleet_160)}")
assert len(fleet_160) == 160, f"Expected 160 units, got {len(fleet_160)}"

# Count by badge
badge_counts = {}
for u in fleet_160:
    b = u.get("category_badge", "Other")
    badge_counts[b] = badge_counts.get(b, 0) + 1
print("Category Badges Distribution:", badge_counts)

# Output paths
dest_paths = [
    os.path.join(ROOT_DIR, "data", "fleet.json"),
    os.path.join(ROOT_DIR, "src", "data", "fleet.json"),
    os.path.join(ROOT_DIR, "tools", "ghost-factory-console", "src", "data", "fleet.json"),
]

for p in dest_paths:
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as out_f:
        json.dump(fleet_160, out_f, indent=2)
    print(f"✓ Wrote 160 units to: {p}")
