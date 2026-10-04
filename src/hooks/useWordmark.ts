import { useEffect, useState } from 'react';
import markSrc from '../assets/brand/abl-mark.png';
import { LAB_INFO } from '../data/labData';
import { rasterWordmark, type WordmarkRaster } from '../components/3d/shapes/wordmark';

const FONT = '"IBM Plex Sans", system-ui, sans-serif';

/** Loads the lab mark and its typeface, then rasterises them for the closing point-cloud shape. */
export function useWordmark(): WordmarkRaster | null {
  const [raster, setRaster] = useState<WordmarkRaster | null>(null);

  useEffect(() => {
    let live = true;
    const image = new Image();
    image.src = markSrc;
    Promise.all([image.decode(), document.fonts.load(`500 78px ${FONT}`)])
      .then(() => {
        if (live) setRaster(rasterWordmark(image, LAB_INFO.shortName, FONT));
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);

  return raster;
}
