

## Usage
const types = await getPackageTypes('react', '16.14.0');
console.log('package types', types); // {[fileName]: fileTextContents}

// Example output... {
  'dist/communication.d.ts': 'import { EventDispatcher } from "./dispatcher";...
  'dist/dispatcher.d.ts': 'export declare abstract class EventDispatcher {\r\n'";...
}