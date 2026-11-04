import sharp from 'sharp';

const IMAGE_TYPES=new Set(['image/jpeg','image/png','image/webp']);

/** True when the image carries hidden data (GPS position, camera, date, comments) or needs rotating. */
export async function hasImageMetadata(buffer){
 const m=await sharp(buffer,{failOn:'none'}).metadata();
 return Boolean(m.exif||m.xmp||m.iptc||m.comments?.length||(m.orientation&&m.orientation!==1));
}

/**
 * Removes EXIF/XMP/IPTC (phone photos store where and when they were taken) and bakes in the rotation.
 * Returns the original buffer when there is nothing to remove, so clean images are not re-compressed.
 */
export async function stripImageMetadata(buffer,mime){
 if(!IMAGE_TYPES.has(mime))return buffer;
 if(!(await hasImageMetadata(buffer)))return buffer;
 const img=sharp(buffer,{failOn:'none'}).rotate();
 if(mime==='image/jpeg')return img.jpeg({quality:90,mozjpeg:true}).toBuffer();
 if(mime==='image/png')return img.png({compressionLevel:9}).toBuffer();
 return img.webp({quality:90}).toBuffer();
}
