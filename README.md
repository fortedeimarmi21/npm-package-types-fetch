##  Usage

const types = await getPackageTypes('react', '16.14.0');
console.log('package types', types); 

##  Note

Package version should be specified, support for automatically fetching a latest ver. will be addded in future

##  Example

// import { getPackageTypes } from 'npm-package-types-fetch/build/src';


	(async () => {

		const types = await getPackageTypes('react', '16.14.0');

		console.log('package types', types);

	})()

  
  

// Example output... 
{

	'dist/communication.d.ts': 'import { EventDispatcher } from "./dispatcher";...

	'dist/dispatcher.d.ts': 'export declare abstract class EventDispatcher {'";...

}
