export const FilePortSymbol = Symbol('FilePort');

export interface FilePort {
  saveImage(fileName: string, file: Buffer, ext: string);
  //deleteImage();
}
