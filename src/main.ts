import { getPackageTypes } from "./registry.service";
import * as fs from 'fs';



// Or

(async () => {
  const types = await getPackageTypes('react');
  
  fs.writeFile("./files.txt", types[Object.keys(types)[0]], function(err) {
    if(err) {
        return console.log(err);
    }
    console.log("The file was saved!");
}); 
})()

// examples
// (async () => {
//   const types = await getPackageTypes('iframe_communication', '1.1.3');
//   console.log('package types', types);
// })()