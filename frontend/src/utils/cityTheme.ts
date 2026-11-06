import { GeoLocation } from '../types/location';

export type SceneryType = 'windmill' | 'mountains' | 'skyline' | 'coastal' | 'desert';

/**
 * Logically maps any city or geographic location to an artistic scenery archetype.
 * Default is 'windmill' (pastoral / countryside), which directly mirrors the
 * classic serene landscape in the reference design (Bhopal, plains, countryside).
 */
export function getCitySceneryType(location?: GeoLocation | null): SceneryType {
  if (!location) return 'windmill';

  const name = (location.name || '').toLowerCase();
  const country = (location.country || '').toLowerCase();
  const admin1 = (location.admin1 || '').toLowerCase();
  const elevation = location.elevation ?? 0;

  // 1. Mountainous / Alpine / Valleys (Elevation > 750m or known mountain destinations)
  if (
    elevation > 750 ||
    /mountain|alps|himalaya|shimla|srinagar|leh|manali|gangtok|dharamsala|kathmandu|pokhara|zurich|bern|innsbruck|banff|aspen|denver|boulder|salt lake|quito|bogota|la paz|cusco|geneva|reykjavik|chamonix|zermatt/.test(name) ||
    /nepal|switzerland|austria|bhutan/.test(country) ||
    /himachal|uttarakhand|jammu|kashmir|sikkim|ladakh|colorado|utah|alaska/.test(admin1)
  ) {
    return 'mountains';
  }

  // 2. Coastal / Waterfront / Beaches / Islands
  if (
    /mumbai|goa|kochi|chennai|panaji|honolulu|miami|san francisco|los angeles|san diego|barcelona|valencia|sydney|melbourne|perth|auckland|maldives|nice|marseille|venice|naples|rio|cape town|lisbon|porto|havana|cancun|phuket|bali|santorini|dubrovnik|alexandria|monaco|ibiza/.test(name) ||
    /island|coast|beach|port|bay/.test(name) ||
    /maldives|bahamas|fiji|hawaii|cyprus|malta/.test(country) ||
    /goa|kerala|hawaii/.test(admin1)
  ) {
    return 'coastal';
  }

  // 3. Arid / Desert
  if (
    /cairo|riyadh|jeddah|doha|dubai|abu dhabi|muscat|kuwait|phoenix|tucson|las vegas|jaipur|jodhpur|bikaner|jaisalmer|marrakech|casablanca|baghdad|amman|sharjah/.test(name) ||
    /egypt|saudi arabia|qatar|oman|kuwait|united arab emirates|uae|bahrain/.test(country) ||
    /rajasthan|arizona|nevada/.test(admin1)
  ) {
    return 'desert';
  }

  // 4. Major Urban Metropolises / Skylines
  if (
    /new york|nyc|tokyo|london|paris|delhi|new delhi|beijing|shanghai|hong kong|singapore|seoul|toronto|chicago|seattle|berlin|frankfurt|madrid|moscow|bangkok|kuala lumpur|jakarta|manila|mexico city|buenos aires|sao paulo|bengaluru|bangalore|hyderabad|kolkata|dallas|houston|boston/.test(name)
  ) {
    return 'skyline';
  }

  // 5. Default: Pastoral / Windmill (like Bhopal, Amsterdam, plains, countryside)
  // Perfectly matches the reference art with the rotating windmill, rolling hills, and acacia trees!
  return 'windmill';
}

