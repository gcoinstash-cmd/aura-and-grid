# Security & Compliance Specification: {{ASSET_NAME}}

> **Asset ID:** {{ASSET_ID}}  
> **Pricing Track:** Track 2 — Flagship Tier-1 SCADA/Deep-Tech Hypercar  
> **Classification:** Level 3 Deployable Blueprint & Interactive Prototype  
> **Governance Standard:** NIST SP 800-218 (SSDF v1.1) / CIS Software Supply Chain Security  

---

## 1. Compliance Framework Alignment

This software blueprint is engineered in strict alignment with the **National Institute of Standards and Technology (NIST) Special Publication 800-218: Secure Software Development Framework (SSDF v1.1)** and the **Center for Internet Security (CIS) Software Supply Chain Security Benchmark**:

* **Prepare the Organization (PO):** Standardized architecture across all Track 2 flagships enforces deterministic quality gates, static AST validation, and strict role-based access control (RBAC) modeling.
* **Protect Software (PS):**
  - **Zero Hardcoded Credentials:** Zero API keys, database connection strings, JWT secrets, or cloud tokens committed to source control or bundled into client distributions.
  - **Environment Injection:** All credentials injected exclusively via deployment environment variables (`.env`, `.env.local`), governed by `.gitignore` exclusions and documented via sanitized `.env.example`.
* **Produce Well-Secured Software (PW):**
  - **Deterministic Builds:** Pinned dependencies in lockfiles with clean compilation (`npm run build` exits code 0).
  - **Database Security:** Supabase PostgreSQL migrations enforce Row Level Security (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY;`) across 100% of tables and views.
* **Respond to Vulnerabilities (RV):** Continuous supply chain scanning via `npm audit` enforcing zero Critical or High CVE dependencies.

---

## 2. Secrets Management & Access Control Policy

| Control Layer | Enforcement Mechanism | Status |
|---|---|:---:|
| **Git Exclusion** | `.gitignore` enforces exclusion of `.env`, `.env.local`, `.env.*` | Enforced |
| **Credential Template** | Pinned `.env.example` with non-functional placeholders only | Enforced |
| **Static Code Scan** | Pre-merge regex secret scanners block token commits | Enforced |
| **Client Bundles** | Zero private keys exposed to browser runtime | Enforced |
| **Database Policies** | Supabase RLS policies restrict table read/write access | Enforced |

---

## 3. Dependency Integrity & Vulnerability Standard

* **Vulnerability Ceiling:** **0 Critical CVEs** and **0 High CVEs** across all runtime dependencies.
* **Permissive Licensing (Pillar 4):** 100% permissive licenses (MIT, Apache-2.0, BSD-2/3, ISC, 0BSD). Zero copyleft (GPL, AGPL) contamination.
* **Software Bill of Materials (SBOM):** Machine-readable dependency inventories maintained in CycloneDX (`sbom.cdx.json`) and SPDX (`sbom.spdx.json`) formats.

---

## 4. Product Truth & Maturity Classification

> [!CAUTION]
> **SIMULATION & PROTOTYPE NOTICE (NON-PRODUCTION MATURITY):**
> * **Asset Maturity:** This repository contains a **Technical Simulation & Clickable Interactive Prototype**.
> * **Non-Production Status:** This asset is not certified, flight-qualified, space-qualified, medical-grade, financial-grade, or safety-certified for live operational deployment.
> * **Simulated Feeds:** All SCADA dials, physics telemetry, orbit dynamics, and database records operate on client-side simulation engines and sample datasets.
> * **Client Production Requirements:** Live operational deployment requires customer-specific backend infrastructure, regulatory compliance certification, safety analysis, and independent security penetration testing.

---

## 5. Mandatory Verification Checklist

Before certifying any Track 2 flagship for delivery, lease, or selective micro-APA transfer:
- [ ] `COMPLIANCE.md` populated with asset-specific identifiers and architecture notes.
- [ ] `.env.example` created with strict variable documentation and zero secrets.
- [ ] `README.md` includes the standardized NIST SP 800-218 Security & Integrity block.
- [ ] UI displays prominent "Simulation / Non-Production" product truth disclosures.
- [ ] `npm run build` completes with Exit Code 0 and zero blocking TypeScript errors.
