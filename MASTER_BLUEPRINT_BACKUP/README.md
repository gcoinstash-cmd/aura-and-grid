# Aura & Grid × GhostFactoryOS

## Security & Integrity Specification
- **Framework Alignment:** NIST SP 800-218 (SSDF v1.1) / CIS Software Supply Chain
- **Asset Maturity:** Simulation & Clickable Prototype (Non-Production)
- **Secrets Management:** Zero hardcoded credentials (Env injected)
- **Dependency Audit:** Clean build, 0 Critical CVEs
- **IP Status:** Flagship Class (Track 2 - Retained Core Factory IP)

---

## 1. System Overview & Product Truth Classification

Aura & Grid is a curated digital showroom and software asset dealership paired with GhostFactoryOS, a private digital manufacturing command center.

> [!IMPORTANT]
> **PRODUCT TRUTH & REGULATORY DISCLOSURE:**
> All digital vehicles, consoles, and web applications cataloged within this repository are **Simulations, Interactive Prototypes, and Deployable Source Blueprints**.
> - **Non-Production Status:** None of the assets represent live, flight-certified, space-qualified, or safety-certified operational systems.
> - **Simulated Telemetry:** All SCADA, orbital mechanics, industrial sensor feeds, clinical trial data, and financial records utilize mathematical simulation engines and deterministic mock states.
> - **Regulatory Exclusions:** These assets do not constitute legal, medical, financial, or engineering compliance certifications. Production deployment requires customer-specific backend configuration, regulatory auditing, and independent security hardening.

---

## 2. Architecture & Separation of Concerns

The repository enforces a strict two-faced architecture:
1. **Public Showroom (`site/`):** Decoupled, read-only static showroom for interactive test drives, tier-1 license previews, and technical briefs. Zero privileged factory credentials or passkeys are bundled in the public showroom bundle.
2. **Private Command Center (`tools/ghost-factory-console/`):** React 18 + TypeScript + Tailwind CSS executive console (`ghost-factory-console`) providing ledger analytics, fleet valuation stress testing, maintenance bays, and deal room management.

---

## 3. NIST SP 800-218 (SSDF) Supply Chain Compliance

To ensure secure software development practices under NIST SP 800-218:
- **Protect Software (PS):** All sensitive environment variables (`.env`, `.env.local`) are strictly excluded from version control via `.gitignore`. Template credentials are documented exclusively in sanitized `.env.example` files.
- **Produce Well-Secured Software (PW):** Zero hardcoded API tokens or service keys reside in source code. Code replacement and formatting are strictly tracked and audited.
- **Respond to Vulnerabilities (RV):** Continuous `npm audit` verification enforces 0 Critical CVEs across the dependency tree.

---

## 4. Dual-Track Portfolio Structure

| Parameter | Track 1: Lean Rapid-Sale (Default) | Track 2: Flagship Tier-1 (Selective) |
|---|---|---|
| **Fleet Count** | 86 Assets | 50 Deep-Tech SCADA Assets |
| **Retail License** | \$199 | \$1,500 – \$3,500 |
| **Commercial Team Seat** | \$599 | Custom Fleet Lease |
| **Exclusive Buyout Anchor** | \$4,500 (\$3,800 – \$6,500 floor) | \$14,500 (\$10,000 – \$18,000 entry) |
| **Retention Policy** | Transferable via Micro-APA | Strict 80% Retained Factory Floor (Max 27 APAs across fleet) |

---

## 5. Verification & Build Commands

```bash
# Verify Supply Chain Dependencies (0 Critical CVEs)
npm audit

# Run Full Build (Public Showroom + Private Console + 5 Audit Gates)
npm run build

# Synchronize Blueprints Across Local & Cloud Master Vaults
npm run sync:master
```
