## About
Use this package to get npm package type files,
get npm package versions from an API. 

Specify package name and version, or use "*" to get the latest package version;
It checks for a package type definition files in a package itself, and if not found checks in @types/{packageName}@{packageVer}. 
If there is no types available for current ver., types from a last previous version returned;

## Usage
const types = await getPackageTypes('react', '16.14.0');
console.log('package types', types);

// Get latest npm package version type definition files
const types = await getPackageTypes('react');
console.log('package types', types); //

## Note
package version should be specified, support for automatically fetching a latest ver. will be addded in future;

## Example

// import * as fs from 'fs';
// import { getPackageTypes } from 'npm-package-types-fetch/build/src';

 (async () => {
   const types = await getPackageTypes('react', '16.14.0');
   console.log('package types', types);

// Example output... {
  'dist/communication.d.ts': 'import { EventDispatcher } from "./dispatcher";...
  'dist/dispatcher.d.ts': 'export declare abstract class EventDispatcher {\r\n'";...
}