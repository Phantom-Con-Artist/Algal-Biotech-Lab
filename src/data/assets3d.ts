/**
 * Every file the 3D scenes load, in one place, so the preloader fetches exactly the URLs the scenes
 * will ask for (a different query string would be a different cache entry).
 */

/** Bump whenever the room is re-exported from Blender, so browsers never pair a cached model with new code. */
export const ROOM_VERSION = '3';

export const MODELS = {
  cell: '/models/chlamydomonas.glb',
  lab: '/models/lab.glb',
  room: `/models/lab-room.glb?v=${ROOM_VERSION}`,
};

export const DETAIL_MAPS = {
  granular: '/models/detail-granular-n.webp',
  fibrous: '/models/detail-fibrous-n.webp',
  membrane: '/models/detail-membrane-n.webp',
  variation: '/models/detail-variation.webp',
};

export const ROOM_LIGHTMAPS = {
  shell: `/models/lab-room/lm-shell.webp?v=${ROOM_VERSION}`,
  furniture: `/models/lab-room/lm-furniture.webp?v=${ROOM_VERSION}`,
  instruments: `/models/lab-room/lm-instruments.webp?v=${ROOM_VERSION}`,
};

export const DRACO_PATH = '/draco/';
export const DRACO = [`${DRACO_PATH}draco_wasm_wrapper.js`, `${DRACO_PATH}draco_decoder.wasm`];

/** What the home film's first screen needs: the page waits for these. */
export const HOME_CRITICAL = [...DRACO, MODELS.cell, ...Object.values(DETAIL_MAPS)];
/** What its later chapters need: fetched behind the revealed page, parsed when the scroll gets near. */
export const HOME_DEFERRED = [MODELS.lab, MODELS.room, ...Object.values(ROOM_LIGHTMAPS)];
/** The tour opens in the room, so it needs all of it at once. */
export const TOUR_ASSETS = [...DRACO, MODELS.room, ...Object.values(ROOM_LIGHTMAPS)];
