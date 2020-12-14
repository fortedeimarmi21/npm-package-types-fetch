import { getPackageTypes } from "./registry.service";
import * as fs from 'fs';



// Or

(async () => {
  const types = await getPackageTypes('react','16.4.0');
})()

// examples
// (async () => {
//   const types = await getPackageTypes('iframe_communication', '1.1.3');
//   console.log('package types', types);
// })()