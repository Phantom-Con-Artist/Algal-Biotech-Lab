import { useEffect, useState } from 'react';
import markSrc from '../assets/brand/abl-mark.png';
import { LAB_INFO } from '../data/labData';
import { rasterWordmark, type WordmarkRaster } from '../components/3d/shapes/wordmark';

const FONT = '"IBM Plex Sans", system-ui, sans-serif';

export interface WordmarkState {
  raster: WordmarkRaster | null;
  /** True once loading has finished, whether or not it produced a raster. */
  settled: boolean;
}

/** Loads the lab mark and its typeface, then rasterises them for the closing point-cloud shape. */
export function useWordmark(): WordmarkState {
  const [state, setState] = useState<WordmarkState>({ raster: null, settled: false });

  useEffect(() => {
    let live = true;
    const image = new Image();
    image.src = markSrc;
    Promise.all([image.decode(), document.fonts.load(`500 78px ${FONT}`)])
      .then(() => {
        if (live) setState({ raster: rasterWordmark(image, LAB_INFO.shortName, FONT), settled: true });
      })
      .catch(() => {
        if (live) setState({ raster: null, settled: true });
      });
    return () => {
      live = false;
    };
  }, []);

  return state;
}
