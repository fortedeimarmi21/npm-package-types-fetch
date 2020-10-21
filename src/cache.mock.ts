let fileNamesCache = {

}

export const setFileFullPaths = (packageName: string, packageVersion: string, filePaths: string[]) => {
  const dataSlice = fileNamesCache[packageName] || {};
  dataSlice[packageVersion] = filePaths;

  fileNamesCache = {
    ...fileNamesCache, [packageName]: dataSlice
  }
  console.debug('cache::setFileFullPaths', fileNamesCache);
  return fileNamesCache;
}