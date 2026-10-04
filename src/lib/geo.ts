const MAP_BOUNDS = {
  minLat: 25.4315,
  maxLat: 25.4390,
  minLng: 81.8410,
  maxLng: 81.8515,
  width: 800,
  height: 500,
};

export const toMapCoordinate = (
  value: unknown,
  fallback = { x: 400, y: 250 }
): { x: number; y: number; width?: number; height?: number } => {
  if (!value || typeof value !== 'object') return fallback;
  const raw = value as Record<string, unknown>;

  if (typeof raw.x === 'number' && typeof raw.y === 'number') {
    return {
      x: raw.x,
      y: raw.y,
      ...(typeof raw.width === 'number' ? { width: raw.width } : {}),
      ...(typeof raw.height === 'number' ? { height: raw.height } : {}),
    };
  }

  const lat = Number(raw.lat);
  const lng = Number(raw.lng);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    const x =
      ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) *
      MAP_BOUNDS.width;
    const y =
      MAP_BOUNDS.height -
      ((lat - MAP_BOUNDS.minLat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) *
        MAP_BOUNDS.height;
    return { x: Math.max(0, Math.min(MAP_BOUNDS.width, x)), y: Math.max(0, Math.min(MAP_BOUNDS.height, y)) };
  }

  return fallback;
};
