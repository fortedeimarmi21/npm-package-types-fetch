import fetch from 'node-fetch';
import { setFileFullPaths } from './cache.mock';
import { GetPackageTypesConfig } from './registry.models';
import { decompressBuffer } from './utils';

const NPM_REGISTRY_ENDPOINT = 'http://registry.npmjs.org';

/** Get available version for a given npm package name */
export const getPackageVersions = async (packageName: string): Promise<string[]> => {
  const response = await fetch(`${NPM_REGISTRY_ENDPOINT}/${packageName}`)
    .then(res => res.json())
    .catch(() => ({error: 'not found'}));
  console.debug('getPackageVersions - package metadata \n', response);

  const versions = Object.keys(response.versions).sort((a, b) => {
    const regex = /(\d{1,}.\d{1,}.\d{1,})/;
    // sort package verisons 16.3.4 > 15.4.5 and etc
    return a.match(regex)[0].replace(/(?<=\.\d{1,})\./g, '') > b.match(regex)[0].replace(/(?<=\.\d{1,})\./g, '') ? -1 : 1;
  });
  console.debug('getPackageVersions - versions \n', versions);

  return versions;
}
/** Get a package type definition files of a given package name and version */
export const getPackageTypes = async (packageName: string, packageVersion = '*', config?: GetPackageTypesConfig): Promise<{[key: string]: string}> => {
  console.debug('getPackageTypes::/n', packageName, packageVersion);

  const packageMetadata = await fetch(`${NPM_REGISTRY_ENDPOINT}/${packageName}/${packageVersion}`)
    .then(res => res.json())
    .catch(() => ({error: 'not found'}));
  
  const distUrl = packageMetadata.dist.tarball;

  console.debug('getPackageTypes - package metadata \n', packageMetadata);
  console.debug('getPackageTypes - tarball url', packageMetadata.dist.tarball);

  const response = await fetch(distUrl);
	const buffer = await response.buffer();
  const files = await decompressBuffer(buffer);

  let packageTypes;

  if (config?.readFilesDataFromBuffer) {
    console
  } else {
    packageTypes = files.filter(file => (file.path as string).endsWith('d.ts')).map(file => file.path);
  }
  console.debug('getPackageTypes - filePaths', packageTypes);
  setFileFullPaths(packageName, packageVersion, packageTypes);

    
  return packageMetadata;
}