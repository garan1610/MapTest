export const Hanoi: [number, number] = [105.8342, 21.0278]; // Longitude, Latitude

export interface LocationResponse {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

export async function getLocation() {
  try {
    const response = await fetch("http://ip-api.com/json/");
    const json = (await response.json()) as LocationResponse;
    if (typeof json.lat === "number" && typeof json.lon === "number") {
      return [json.lon, json.lat] as [number, number];
    }
  } catch {}
  return Hanoi;
}
