import * as decompress from 'decompress';
import * as decompressTargz from 'decompress-targz';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const decompressBuffer = (buffer: Buffer): Promise<any> => {
  return decompress(buffer, {
    plugins: [decompressTargz()],
  });
};
