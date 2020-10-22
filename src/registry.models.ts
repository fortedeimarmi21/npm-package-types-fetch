export interface GetPackageTypesConfig {
  /** @description 
   * Use this option if you don't want to make additional requests to unpkg for retreiving .d.ts files contents as a text
   * Text value would be retreived from an unpacked package archive, processing buffer may take some time and will
   * require more space in cache to store those files contents. With this set to false, you migth store only filepathname in a cache */
  readFilesDataFromBuffer: boolean;
}