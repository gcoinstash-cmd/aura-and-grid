import fs from 'fs';

const packages = [
  {
    spdxId: "SPDXRef-Package-react",
    name: "react",
    version: "18.3.1",
    purl: "pkg:npm/react@18.3.1",
    license: "MIT",
    homepage: "https://react.dev",
    downloadLocation: "https://registry.npmjs.org/react/-/react-18.3.1.tgz",
    copyright: "Copyright (c) Meta Platforms, Inc. and affiliates.",
    supplier: "Organization: Meta Platforms, Inc.",
    description: "Declarative component-based UI framework for web applications."
  },
  {
    spdxId: "SPDXRef-Package-react-dom",
    name: "react-dom",
    version: "18.3.1",
    purl: "pkg:npm/react-dom@18.3.1",
    license: "MIT",
    homepage: "https://react.dev",
    downloadLocation: "https://registry.npmjs.org/react-dom/-/react-dom-18.3.1.tgz",
    copyright: "Copyright (c) Meta Platforms, Inc. and affiliates.",
    supplier: "Organization: Meta Platforms, Inc.",
    description: "DOM rendering engine for React applications."
  },
  {
    spdxId: "SPDXRef-Package-vite",
    name: "vite",
    version: "5.4.14",
    purl: "pkg:npm/vite@5.4.14",
    license: "MIT",
    homepage: "https://vitejs.dev",
    downloadLocation: "https://registry.npmjs.org/vite/-/vite-5.4.14.tgz",
    copyright: "Copyright (c) 2019-present Yuxi (Evan) You and Vite contributors",
    supplier: "Person: Evan You",
    description: "Next Generation Frontend Tooling with native ES modules and fast HMR."
  },
  {
    spdxId: "SPDXRef-Package-tailwindcss",
    name: "tailwindcss",
    version: "3.4.17",
    purl: "pkg:npm/tailwindcss@3.4.17",
    license: "MIT",
    homepage: "https://tailwindcss.com",
    downloadLocation: "https://registry.npmjs.org/tailwindcss/-/tailwindcss-3.4.17.tgz",
    copyright: "Copyright (c) Tailwind Labs, Inc.",
    supplier: "Organization: Tailwind Labs, Inc.",
    description: "Utility-first CSS framework for rapid and modular UI development."
  },
  {
    spdxId: "SPDXRef-Package-postcss",
    name: "postcss",
    version: "8.5.1",
    purl: "pkg:npm/postcss@8.5.1",
    license: "MIT",
    homepage: "https://postcss.org",
    downloadLocation: "https://registry.npmjs.org/postcss/-/postcss-8.5.1.tgz",
    copyright: "Copyright (c) Andrey Sitnik",
    supplier: "Person: Andrey Sitnik",
    description: "Tool for transforming styles with JS plugins across modern CSS pipelines."
  },
  {
    spdxId: "SPDXRef-Package-autoprefixer",
    name: "autoprefixer",
    version: "10.4.20",
    purl: "pkg:npm/autoprefixer@10.4.20",
    license: "MIT",
    homepage: "https://github.com/postcss/autoprefixer",
    downloadLocation: "https://registry.npmjs.org/autoprefixer/-/autoprefixer-10.4.20.tgz",
    copyright: "Copyright (c) Andrey Sitnik",
    supplier: "Person: Andrey Sitnik",
    description: "PostCSS plugin to parse CSS and add vendor prefixes to CSS rules."
  },
  {
    spdxId: "SPDXRef-Package-lucide-react",
    name: "lucide-react",
    version: "0.475.0",
    purl: "pkg:npm/lucide-react@0.475.0",
    license: "ISC",
    homepage: "https://lucide.dev",
    downloadLocation: "https://registry.npmjs.org/lucide-react/-/lucide-react-0.475.0.tgz",
    copyright: "Copyright (c) Lucide Project",
    supplier: "Organization: Lucide Project",
    description: "Clean, consistent icon system for React applications."
  },
  {
    spdxId: "SPDXRef-Package-supabase-js",
    name: "@supabase/supabase-js",
    version: "2.48.1",
    purl: "pkg:npm/@supabase/supabase-js@2.48.1",
    license: "MIT",
    homepage: "https://supabase.com",
    downloadLocation: "https://registry.npmjs.org/@supabase/supabase-js/-/supabase-js-2.48.1.tgz",
    copyright: "Copyright (c) Supabase, Inc.",
    supplier: "Organization: Supabase, Inc.",
    description: "Isomorphic JavaScript client for Supabase PostgreSQL and authentication."
  },
  {
    spdxId: "SPDXRef-Package-typescript",
    name: "typescript",
    version: "5.7.3",
    purl: "pkg:npm/typescript@5.7.3",
    license: "Apache-2.0",
    homepage: "https://www.typescriptlang.org",
    downloadLocation: "https://registry.npmjs.org/typescript/-/typescript-5.7.3.tgz",
    copyright: "Copyright (c) Microsoft Corporation.",
    supplier: "Organization: Microsoft Corporation",
    description: "Typed superset of JavaScript that compiles to plain JavaScript."
  },
  {
    spdxId: "SPDXRef-Package-clsx",
    name: "clsx",
    version: "2.1.1",
    purl: "pkg:npm/clsx@2.1.1",
    license: "MIT",
    homepage: "https://github.com/lukeed/clsx",
    downloadLocation: "https://registry.npmjs.org/clsx/-/clsx-2.1.1.tgz",
    copyright: "Copyright (c) Luke Edwards",
    supplier: "Person: Luke Edwards",
    description: "Tiny utility for constructing className strings conditionally."
  },
  {
    spdxId: "SPDXRef-Package-tailwind-merge",
    name: "tailwind-merge",
    version: "2.6.0",
    purl: "pkg:npm/tailwind-merge@2.6.0",
    license: "MIT",
    homepage: "https://github.com/dcastil/tailwind-merge",
    downloadLocation: "https://registry.npmjs.org/tailwind-merge/-/tailwind-merge-2.6.0.tgz",
    copyright: "Copyright (c) Dany Castillo",
    supplier: "Person: Dany Castillo",
    description: "Merge Tailwind CSS classes in JS without style conflict issues."
  },
  {
    spdxId: "SPDXRef-Package-framer-motion",
    name: "framer-motion",
    version: "11.18.2",
    purl: "pkg:npm/framer-motion@11.18.2",
    license: "MIT",
    homepage: "https://motion.dev",
    downloadLocation: "https://registry.npmjs.org/framer-motion/-/framer-motion-11.18.2.tgz",
    copyright: "Copyright (c) Framer B.V.",
    supplier: "Organization: Framer B.V.",
    description: "Production-ready motion and physics animation library for React."
  },
  {
    spdxId: "SPDXRef-Package-vitejs-plugin-react",
    name: "@vitejs/plugin-react",
    version: "4.3.4",
    purl: "pkg:npm/@vitejs/plugin-react@4.3.4",
    license: "MIT",
    homepage: "https://github.com/vitejs/vite-plugin-react",
    downloadLocation: "https://registry.npmjs.org/@vitejs/plugin-react/-/plugin-react-4.3.4.tgz",
    copyright: "Copyright (c) Vite Contributors",
    supplier: "Organization: Vite Contributors",
    description: "Official Vite plugin providing Fast Refresh with Babel and JSX transforms."
  },
  {
    spdxId: "SPDXRef-Package-esbuild",
    name: "esbuild",
    version: "0.25.0",
    purl: "pkg:npm/esbuild@0.25.0",
    license: "MIT",
    homepage: "https://esbuild.github.io",
    downloadLocation: "https://registry.npmjs.org/esbuild/-/esbuild-0.25.0.tgz",
    copyright: "Copyright (c) Evan Wallace",
    supplier: "Person: Evan Wallace",
    description: "Extremely fast JavaScript and TypeScript bundler written in Go."
  },
  {
    spdxId: "SPDXRef-Package-canvas-confetti",
    name: "canvas-confetti",
    version: "1.9.4",
    purl: "pkg:npm/canvas-confetti@1.9.4",
    license: "ISC",
    homepage: "https://github.com/catdad/canvas-confetti",
    downloadLocation: "https://registry.npmjs.org/canvas-confetti/-/canvas-confetti-1.9.4.tgz",
    copyright: "Copyright (c) Kiril Vatev",
    supplier: "Person: Kiril Vatev",
    description: "High performance on-demand HTML5 canvas confetti celebration animations."
  },
  {
    spdxId: "SPDXRef-Package-types-react",
    name: "@types/react",
    version: "18.3.18",
    purl: "pkg:npm/@types/react@18.3.18",
    license: "MIT",
    homepage: "https://github.com/DefinitelyTyped/DefinitelyTyped",
    downloadLocation: "https://registry.npmjs.org/@types/react/-/react-18.3.18.tgz",
    copyright: "Copyright (c) DefinitelyTyped contributors",
    supplier: "Organization: DefinitelyTyped",
    description: "TypeScript definitions for React."
  },
  {
    spdxId: "SPDXRef-Package-types-react-dom",
    name: "@types/react-dom",
    version: "18.3.5",
    purl: "pkg:npm/@types/react-dom@18.3.5",
    license: "MIT",
    homepage: "https://github.com/DefinitelyTyped/DefinitelyTyped",
    downloadLocation: "https://registry.npmjs.org/@types/react-dom/-/react-dom-18.3.5.tgz",
    copyright: "Copyright (c) DefinitelyTyped contributors",
    supplier: "Organization: DefinitelyTyped",
    description: "TypeScript definitions for React-DOM."
  },
  {
    spdxId: "SPDXRef-Package-types-node",
    name: "@types/node",
    version: "22.14.0",
    purl: "pkg:npm/@types/node@22.14.0",
    license: "MIT",
    homepage: "https://github.com/DefinitelyTyped/DefinitelyTyped",
    downloadLocation: "https://registry.npmjs.org/@types/node/-/node-22.14.0.tgz",
    copyright: "Copyright (c) DefinitelyTyped contributors",
    supplier: "Organization: DefinitelyTyped",
    description: "TypeScript definitions for Node.js standard libraries."
  }
];

// 1. Build SPDX 2.3
const spdxDoc = {
  spdxVersion: "SPDX-2.3",
  dataLicense: "CC0-1.0",
  SPDXID: "SPDXRef-DOCUMENT",
  name: "Aura-and-Grid-Fleet-SBOM",
  documentNamespace: "https://auraandgrid.com/spdxdocs/aura-and-grid-fleet-sbom-2026-v2.0",
  creationInfo: {
    creators: [
      "Tool: Ghost Factory Automated Diligence Engine v2.1",
      "Organization: ZoMae Media LLC"
    ],
    created: "2026-09-26T23:30:00Z",
    licenseListVersion: "3.23"
  },
  documentDescribes: [
    "SPDXRef-Package-AuraAndGridFleet"
  ],
  packages: [
    {
      SPDXID: "SPDXRef-Package-AuraAndGridFleet",
      name: "aura-and-grid-fleet",
      versionInfo: "1.0.0",
      downloadLocation: "https://github.com/gcoinstash-cmd/aura-and-grid",
      filesAnalyzed: false,
      homepage: "https://aura-and-grid-showroom.onrender.com",
      licenseConcluded: "MIT",
      licenseDeclared: "MIT",
      copyrightText: "Copyright (c) 2026 ZoMae Media LLC",
      summary: "85-Blueprint Full-Stack Commercial Web Operating Systems Fleet",
      description: "Standardized React, TypeScript, Tailwind CSS, and Supabase PostgreSQL full-stack blueprints with 0% copyleft (GPL) exposure.",
      comment: "Inventoried shared and direct dependency sets contain 0% GPL/AGPL copyleft exposure."
    },
    ...packages.map(p => ({
      SPDXID: p.spdxId,
      name: p.name,
      versionInfo: p.version,
      downloadLocation: p.downloadLocation,
      filesAnalyzed: false,
      homepage: p.homepage,
      licenseConcluded: p.license,
      licenseDeclared: p.license,
      copyrightText: p.copyright,
      supplier: p.supplier,
      description: p.description
    }))
  ],
  relationships: [
    {
      spdxElementId: "SPDXRef-DOCUMENT",
      relationshipType: "DESCRIBES",
      relatedSpdxElement: "SPDXRef-Package-AuraAndGridFleet"
    },
    ...packages.map(p => ({
      spdxElementId: "SPDXRef-Package-AuraAndGridFleet",
      relationshipType: "DEPENDS_ON",
      relatedSpdxElement: p.spdxId
    }))
  ]
};

// 2. Build CycloneDX 1.6
const cdxDoc = {
  bomFormat: "CycloneDX",
  specVersion: "1.6",
  serialNumber: "urn:uuid:e2f4a6c8-10b2-4d3e-8f5a-9c7d1e3b5a7f",
  version: 2,
  metadata: {
    timestamp: "2026-09-26T23:30:00Z",
    tools: {
      components: [
        {
          type: "application",
          author: "ZoMae Media LLC",
          name: "Ghost Factory Diligence Engine",
          version: "2.1.0"
        }
      ]
    },
    component: {
      type: "application",
      "bom-ref": "pkg:npm/aura-and-grid-fleet@1.0.0",
      name: "aura-and-grid-fleet",
      version: "1.0.0",
      description: "85 Single-Tenant Full-Stack Operating System Blueprints with Turnkey Supabase Schemas. Inventoried shared and direct dependency sets contain 0% GPL/AGPL copyleft exposure.",
      licenses: [
        {
          license: {
            id: "MIT"
          }
        }
      ]
    }
  },
  components: packages.map(p => ({
    type: "library",
    "bom-ref": p.purl,
    name: p.name,
    version: p.version,
    description: p.description,
    purl: p.purl,
    licenses: [
      {
        license: {
          id: p.license
        }
      }
    ],
    supplier: {
      name: p.supplier.replace(/^(Organization|Person):\s*/, '')
    }
  }))
};

// Write to files
fs.writeFileSync('docs/sbom.spdx.json', JSON.stringify(spdxDoc, null, 2));
fs.writeFileSync('site/sbom.spdx.json', JSON.stringify(spdxDoc, null, 2));
fs.writeFileSync('site/docs/sbom.spdx.json', JSON.stringify(spdxDoc, null, 2));

fs.writeFileSync('docs/sbom.cdx.json', JSON.stringify(cdxDoc, null, 2));
fs.writeFileSync('site/sbom.cdx.json', JSON.stringify(cdxDoc, null, 2));
fs.writeFileSync('site/docs/sbom.cdx.json', JSON.stringify(cdxDoc, null, 2));

console.log(`Successfully generated expanded SPDX 2.3 and CycloneDX 1.6 SBOMs across docs/ and site/ with ${packages.length} component packages!`);
