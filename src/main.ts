import { getPackageTypes } from "./registry.service";
(async () => {
  const types = await getPackageTypes('fireworks','2.2.6');
})()

// examples
// (async () => {
//   const types = await getPackageTypes('iframe_communication', '1.1.3');
//   console.log('package types', types);
// })()