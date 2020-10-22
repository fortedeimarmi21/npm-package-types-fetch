import fetch from 'node-fetch';
import { floatVersionRegex, NPM_REGISTRY_ENDPOINT, UNPKG_ENDPOINT, version_regex } from './constants';
import { GetPackageTypesConfig } from './registry.models';
import { decompressBuffer } from './utils';

/** Get available version for `
 *  a given npm package name */
export const getPackageVersions = async (packageName: string): Promise<string[]> => {
  
  const response = await fetch(`${NPM_REGISTRY_ENDPOINT}/${packageName}`)
    .then(res => res.json())
    .catch(() => ({error: 'not found'}));
  if (response.error) { return []};
    

  const versions = Object.keys(response.versions).sort((a, b) => {
    // sort package verisons 16.3.4 > 15.4.5 and etc
    return parseFloat(a.match(version_regex)[0].replace(/(?<=\.\d{1,})\./g, '')) > parseFloat(b.match(version_regex)[0].replace(/(?<=\.\d{1,})\./g, '')) ? -1 : 1;
  });
  return versions;
}
/** Get a package type definition files of a given package name and version */
export const getPackageTypes = async (packageName: string, packageVersion = '*', config?: GetPackageTypesConfig): Promise<{[key: string]: string}> => {
  let types = {};
  const packageTypes = await retreivePackageTypeFiles(packageName, packageVersion, config);
  if (areTypesAvailable(packageTypes)) {
    types = {...packageTypes};
  } else {
    const definetelyTypedTypes = await retreivePackageTypeFiles(`@types/${packageName}`, packageVersion, config);

    if (!areTypesAvailable(definetelyTypedTypes)) {
      const versions = await getPackageVersions(`@types/${packageName}`);
      // try to find previous verison of types
      const lowerVer = versions.find(ver => {
        return parseFloat(ver.match(version_regex)[0].replace(floatVersionRegex, '')) < parseFloat(packageVersion.match(version_regex)[0].replace(floatVersionRegex, ''));
      });
      const definetelyTypedLowerVerTypes = await retreivePackageTypeFiles(`@types/${packageName}`, lowerVer, config);
      types = {...definetelyTypedLowerVerTypes};
    } else {
      types = {...definetelyTypedTypes};
    }
  }
  return types;
}

const areTypesAvailable = (types) => !!Object.entries(types).length;

const retreivePackageTypeFiles = async (packageName: string, packageVersion = '*', config?: GetPackageTypesConfig) => {
  const packageMetadata = await fetch(`${NPM_REGISTRY_ENDPOINT}/${packageName}/${packageVersion}`)
    .then(res => res.json())
    .catch(() => ({error: 'not found'}));
  if (!packageMetadata.dist) { return {}; }
  const distUrl = packageMetadata.dist.tarball;  
  const response = await fetch(distUrl);
	const buffer = await response.buffer();
  const files = await decompressBuffer(buffer);

  let types = {};

  if (config?.readFilesDataFromBuffer) {
    ///tbd
  } else {
    // remove package name in from of a file pathname, react/dist/index.d.ts should become dist/index.d.ts
    const filePaths = files.filter(file => (file.path as string).endsWith('d.ts')).map(file => file.path.match(/(?<=\w+\/).+/g)[0]);
    if (filePaths.length) {
      // Prepeare requests for retreiving types fron unpkg;
      const fileRequests = filePaths.map(path => createTypeDefFileRequest(packageName, packageVersion, path));
      const typesResult: any = await Promise.allSettled(fileRequests);
      for (const [i, promiseResult] of typesResult.entries()) {
        types[filePaths[i]] = promiseResult.value;
      }
    }
  }
  return types;
}

const createTypeDefFileRequest = (packageName: string, packageVersion: string, filePath: string): any => {
  return fetch(`${UNPKG_ENDPOINT}/${packageName}@${packageVersion}/${filePath}`).then(res => res.text());
}