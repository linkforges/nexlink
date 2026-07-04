/**
 * IP2Location.io API Service with key rotation and Redis caching
 */

import { redis } from "./redis";

const API_URL = "https://api.ip2location.io";
const API_KEYS = (process.env.IP2LOCATION_API_KEYS || "")
  .split(",")
  .map(k => k.trim())
  .filter(k => k.length > 0);

const CACHE_TTL = parseInt(process.env.IP2LOCATION_CACHE_TTL || "3600", 10);

export interface GeoData {
  countryCode: string | null;
  countryName: string | null;
  region: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  timezone: string | null;
  isp: string | null;
  asn: string | null;
}

/**
 * Get geolocation data for an IP address.
 * Uses Redis cache and rotates through API keys on failure.
 */
export async function getGeoData(ip: string): Promise<GeoData | null> {
  if (!ip || ip === "0.0.0.0" || ip === "::1") return null;

  // 1. Check Redis cache
  const cacheKey = `geo:${ip}`;
  const cached = await redis.get<string | null>(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. If no API keys, return null
  if (API_KEYS.length === 0) {
    console.warn("[IP2Location] No API keys provided.");
    return null;
  }

  // 3. Try each key in order
  let lastError: Error | null = null;
  for (let i = 0; i < API_KEYS.length; i++) {
    const key = API_KEYS[i];
    try {
      const data = await callAPI(key, ip);
      if (data) {
        // Cache the result
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(data));
        return data;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[IP2Location] Key ${i+1} failed: ${err.message}`);
      continue;
    }
  }

  // All keys failed
  console.error("[IP2Location] All API keys failed.", lastError?.message);
  return null;
}

/**
 * Call IP2Location.io API with a single key.
 */
async function callAPI(apiKey: string, ip: string): Promise<GeoData | null> {
  const url = new URL(API_URL);
  url.searchParams.append("key", apiKey);
  url.searchParams.append("ip", ip);
  url.searchParams.append("format", "json");

  const response = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`HTTP ${response.status}: ${errBody}`);
  }

  const json = await response.json();

  // Check API error
  if (json.error) {
    throw new Error(json.error);
  }

  // If no country_code, it's a private IP or invalid
  if (!json.country_code) return null;

  return {
    countryCode: json.country_code,
    countryName: json.country_name || null,
    region: json.region_name || null,
    city: json.city_name || null,
    latitude: json.latitude ? parseFloat(json.latitude) : null,
    longitude: json.longitude ? parseFloat(json.longitude) : null,
    timezone: json.time_zone?.name || json.time_zone || null,
    isp: json.isp || null,
    asn: json.asn || null,
  };
}

/**
 * Check if IP is private/local (skip API calls to save quota)
 */
export function isPrivateIP(ip: string): boolean {
  if (!ip) return true;
  if (ip === "0.0.0.0" || ip === "::1") return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  if (ip.startsWith("127.")) return true;
  if (ip.startsWith("172.16.") || ip.startsWith("172.17.") ||
      ip.startsWith("172.18.") || ip.startsWith("172.19.") ||
      ip.startsWith("172.20.") || ip.startsWith("172.21.") ||
      ip.startsWith("172.22.") || ip.startsWith("172.23.") ||
      ip.startsWith("172.24.") || ip.startsWith("172.25.") ||
      ip.startsWith("172.26.") || ip.startsWith("172.27.") ||
      ip.startsWith("172.28.") || ip.startsWith("172.29.") ||
      ip.startsWith("172.30.") || ip.startsWith("172.31.")) return true;
  if (ip.startsWith("fe80:") || ip.startsWith("fc00:") || ip.startsWith("fd00:")) return true;
  return false;
}