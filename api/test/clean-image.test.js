import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {hasImageMetadata,stripImageMetadata} from '../src/clean-image.js';

const phonePhoto=(format)=>sharp({create:{width:40,height:20,channels:3,background:'#17b3c6'}})
 .withExif({IFD0:{Make:'TestPhone',Model:'X1'},IFD3:{GPSLatitudeRef:'N',GPSLatitude:'9/1 40/1 0/1',GPSLongitudeRef:'E',GPSLongitude:'80/1 1/1 0/1'}})
 .withMetadata({orientation:6})[format]().toBuffer();

for(const [format,mime] of [['jpeg','image/jpeg'],['png','image/png'],['webp','image/webp']]){
 test(`removes GPS/camera data from ${format} and applies rotation`,async()=>{
  const dirty=await phonePhoto(format);
  assert.equal(await hasImageMetadata(dirty),true);
  const clean=await stripImageMetadata(dirty,mime);
  const meta=await sharp(clean).metadata();
  assert.equal(meta.exif,undefined);
  assert.equal(meta.format,format);
  assert.deepEqual([meta.width,meta.height],[20,40]);
  assert.equal(await hasImageMetadata(clean),false);
 });
}

test('leaves clean images and non-images untouched',async()=>{
 const clean=await sharp({create:{width:8,height:8,channels:3,background:'#fff'}}).jpeg().toBuffer();
 assert.equal(await stripImageMetadata(clean,'image/jpeg'),clean);
 const pdf=Buffer.from('%PDF-1.4 test');
 assert.equal(await stripImageMetadata(pdf,'application/pdf'),pdf);
});
