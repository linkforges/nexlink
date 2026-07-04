import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { PrismaClient } from "@prisma/client/edge";
import { isBot } from "@/lib/utils";
import { getGeoData, isPrivateIP } from "@/lib/p2location";

export const runtime = "edge";

const redis = Redis.fromEnv();
const prisma = new PrismaClient();

function weightedRandomIndex(offers: { url: string; weight: number }[]): number {
  const total = offers.reduce((s, o) => s + o.weight, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < offers.length; i++) {
    rand -= offers[i].weight;
    if (rand <= 0) return i;
  }
  return offers.length - 1;
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.pathname.slice(1);
  const host = req.headers.get("host") || "";

  // 1. Resolve link
  const link = await prisma.link.findUnique({
    where: { domain_slug: { domain: host, slug } },
    include: { user: true },
  });
  if (!link) return NextResponse.redirect(new URL("/404", req.url));

  // 2. Get IP and User-Agent
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             req.headers.get("x-real-ip") ||
             req.ip ||
             "0.0.0.0";
  const userAgent = req.headers.get("user-agent") || "unknown";

  // 3. Bot detection
  if (isBot(userAgent)) {
    return NextResponse.redirect(new URL(link.destinationUrl), { status: 302 });
  }

  // 4. Geo detection using IP2Location.io (with key rotation & caching)
  let country = "XX";
  if (!isPrivateIP(ip)) {
    const geoData = await getGeoData(ip);
    if (geoData?.countryCode) {
      country = geoData.countryCode;
    }
  }

  // 5. Visitor fingerprint
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest(
    "sha256",
    encoder.encode(ip + userAgent + link.id)
  );
  const visitorHash = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  // 6. Check uniqueness
  const isUnique = !(await redis.sismember(`visitors:${link.id}`, visitorHash));
  if (isUnique) await redis.sadd(`visitors:${link.id}`, visitorHash);

  // 7. Logging (Turbo / Slow)
  let clicksToAdd = 0;
  if (link.rotatorMode === "turbo" && isUnique) {
    clicksToAdd = 1;
  } else if (link.rotatorMode === "slow" && country === "US" && isUnique) {
    const luaScript = `
      local current = redis.call('incr', KEYS[1])
      local clicks = math.floor(current / 3)
      local remainder = current % 3
      if clicks > 0 then redis.call('set', KEYS[1], remainder) end
      return clicks
    `;
    const clicks = await redis.eval(luaScript, [`slow_acc:${link.id}`], []);
    clicksToAdd = Number(clicks);
  }

  if (clicksToAdd > 0) {
    fetch(`${req.nextUrl.origin}/api/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        linkId: link.id,
        country,
        clicks: clicksToAdd,
        visitorHash,
        isUnique,
      }),
    }).catch(() => {});
  }

  // 8. Redirect decision
  let finalUrl = link.destinationUrl;
  const offersJson = link.user.countryOffers as any;

  if (offersJson && offersJson[country]?.offers?.length > 0) {
    const config = offersJson[country];
    let chosenIndex: number;

    const isReturning = !isUnique && config.returning_behavior?.enabled;
    if (isReturning) {
      const behavior = config.returning_behavior;
      const offers = config.offers;
      const lastIndexKey = `last_offer:${visitorHash}:${link.id}`;
      const lastIndex = parseInt(await redis.get(lastIndexKey) || "-1");

      if (behavior.mode === "second_offer") {
        chosenIndex = offers.length > 1 ? 1 : 0;
      } else {
        const availableIndices = offers.map((_: any, i: number) => i).filter((i: number) => i !== 0);
        if (availableIndices.length === 0) availableIndices.push(0);
        const currentPos = availableIndices.indexOf(lastIndex);
        const nextPos = (currentPos + 1) % availableIndices.length;
        chosenIndex = availableIndices[nextPos];
      }
      await redis.setex(lastIndexKey, 86400 * 30, chosenIndex.toString());
    } else {
      chosenIndex = weightedRandomIndex(config.offers);
    }
    finalUrl = config.offers[chosenIndex].url;
  }

  // 9. Inject subid
  if (finalUrl.includes("[subid]")) {
    finalUrl = finalUrl.replace("[subid]", link.slug);
  } else {
    finalUrl += (finalUrl.includes("?") ? "&" : "?") + `sub1=${encodeURIComponent(link.slug)}`;
  }

  // 10. Redirect
  return NextResponse.redirect(new URL(finalUrl), { status: 302 });
}