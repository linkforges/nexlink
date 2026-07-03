import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-")
    .trim();
}

/**
 * Detect if a user-agent is a bot/crawler.
 */
export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;

  const botPatterns = [
    "googlebot",
    "bingbot",
    "slurp",
    "duckduckbot",
    "baiduspider",
    "yandexbot",
    "sogou",
    "exabot",
    "facebot",
    "ia_archiver",
    "mediapartners-google",
    "adsbot-google",
    "feedfetcher-google",
    "google-inspectiontool",
    "ahrefs",
    "semrush",
    "majestic",
    "rogerbot",
    "dotbot",
    "mj12bot",
    "seoscanners",
    "serpstatbot",
    "moz",
    "dataforseo",
    "botify",
    "netcraft",
    "crawler",
    "spider",
    "scraper",
    "twitterbot",
    "pinterest",
    "linkedinbot",
    "facebookexternalhit",
    "telegrambot",
    "slackbot",
    "discordbot",
    "pingdom",
    "uptimerobot",
    "statuscake",
    "newrelicpinger",
    "site24x7",
    "freshping",
    "betterstack",
    "healthchecks",
    "headless",
    "phantomjs",
    "puppeteer",
    "selenium",
    "playwright",
    "chrome-headless",
    "headlesschrome",
    "curl",
    "wget",
    "python-requests",
    "python-urllib",
    "java",
    "perl",
    "ruby",
    "go-http-client",
    "php",
    "axios",
    "scrapy",
    "http-client",
    "http-request",
    "http",
    "bot",
    "crawler",
    "scraper",
    "spider",
    "scan",
    "monitor",
  ];

  const lowerUA = userAgent.toLowerCase();
  return botPatterns.some(pattern => lowerUA.includes(pattern));
}