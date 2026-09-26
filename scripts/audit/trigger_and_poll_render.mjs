import fs from 'fs';

const content = fs.readFileSync('.env', 'utf8');
let key = '';
for (const line of content.split('\n')) {
  if (line.startsWith('RENDER_API_KEY=')) {
    key = line.split('=')[1].trim().replace(/^['"]|['"]$/g, '');
  }
}

const servicesToDeploy = [
  { name: 'diamond-cuts-os', id: 'srv-daqf29s9v7es73cuqh3g' },
  { name: 'family-legacy-wealth-os', id: 'srv-daqevt0jo6nc73e74msg' },
  { name: 'the-vineyards-os', id: 'srv-daqetm67bikc738971pg' },
  { name: 'focus-architecture-os', id: 'srv-daqeqvvf3r2c73b3otbg' },
  { name: 'aura-fragrance-os', id: 'srv-daqeo0k9v7es73ctjss0' },
  { name: 'burger-lab-os', id: 'srv-daqe9mid0e5s73a919fg' },
  { name: 'royal-apex-atelier', id: 'srv-daplbh8473hc73c4jmk0' }
];

async function trigger(service) {
  const url = `https://api.render.com/v1/services/${service.id}/deploys`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ clearCache: 'clear' })
  });
  const data = await res.json();
  console.log(`Triggered deploy for ${service.name} (${service.id}): Deploy ID: ${data.id || JSON.stringify(data)}`);
  return { ...service, deployId: data.id };
}

async function checkDeployStatus(serviceId, deployId) {
  const url = `https://api.render.com/v1/services/${serviceId}/deploys/${deployId}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + key,
      'Accept': 'application/json'
    }
  });
  return res.json();
}

async function main() {
  console.log('🚀 Triggering Render Deploys with Cache Clearing...');
  const triggered = [];
  for (const s of servicesToDeploy) {
    const res = await trigger(s);
    triggered.push(res);
  }
  
  console.log('\n⏳ Polling deployment status...');
  let pending = [...triggered];
  const startTime = Date.now();
  
  while (pending.length > 0 && (Date.now() - startTime) < 300000) { // Max 5 mins
    await new Promise(r => setTimeout(r, 10000));
    const nextPending = [];
    for (const item of pending) {
      if (!item.deployId) continue;
      const statusData = await checkDeployStatus(item.id, item.deployId);
      const st = statusData.status;
      console.log(`[${item.name}] Status: ${st}`);
      if (st === 'live') {
        console.log(`✅ ${item.name} is LIVE!`);
      } else if (st === 'build_failed' || st === 'deactivated' || st === 'canceled') {
        console.error(`❌ ${item.name} FAILED: ${st}`);
      } else {
        nextPending.push(item);
      }
    }
    pending = nextPending;
  }
  
  if (pending.length === 0) {
    console.log('\n🎉 ALL 7 RENDER DEPLOYS ARE LIVE!');
  } else {
    console.log(`\n⚠️ Still pending: ${pending.map(p => p.name).join(', ')}`);
  }
}

main().catch(console.error);
