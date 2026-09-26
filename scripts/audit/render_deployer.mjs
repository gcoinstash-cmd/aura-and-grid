import fs from 'fs';

const content = fs.readFileSync('.env', 'utf8');
let key = '';
for (const line of content.split('\n')) {
  if (line.startsWith('RENDER_API_KEY=')) {
    key = line.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
  }
}

async function getServices() {
  let all = [];
  let cursor = null;
  while (true) {
    const url = 'https://api.render.com/v1/services?limit=100' + (cursor ? '&cursor=' + cursor : '');
    const res = await fetch(url, {
      headers: { 'Authorization': 'Bearer ' + key, 'Accept': 'application/json' }
    });
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) break;
    all.push(...items);
    if (items.length < 100) break;
    cursor = items[items.length - 1].cursor;
  }
  return all.map(x => x.service);
}

export async function triggerDeploy(serviceId, clearCache = true) {
  const url = `https://api.render.com/v1/services/${serviceId}/deploys`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ clearCache: clearCache ? 'clear' : 'do_not_clear' })
  });
  return res.json();
}

async function main() {
  const services = await getServices();
  console.log(`Found ${services.length} total Render services.`);
  
  const targets = [
    'burger-lab',
    'aura-fragrance',
    'focus-architecture',
    'the-vineyards',
    'family-legacy-wealth',
    'diamond-cuts',
    'royal-apex'
  ];
  
  const matched = [];
  for (const s of services) {
    for (const t of targets) {
      if (s.name.includes(t)) {
        matched.push(s);
        console.log(`Match: ${s.name} | ID: ${s.id} | Type: ${s.type} | Branch: ${s.branch || s.serviceDetails?.envSpecificDetails?.buildCommand || 'N/A'}`);
      }
    }
  }
  
  return { services, matched };
}

main().catch(console.error);
