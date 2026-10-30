// 24-Kit Master Catalog for CHRONO-ZYMURGY OS
// Public Showcase Edition: Proprietary clone recipes are gated behind the Chrono-Vault Secret.
// Features 1 fully unlocked original flagship reference recipe (Chrono-Haze τ-Zero).

// Helper: Check if Chrono-Vault is unlocked via Environment Variable or Browser Key
export function isVaultUnlocked() {
  if (typeof window !== "undefined") {
    const key = window.localStorage?.getItem("CHRONO_VAULT_KEY");
    if (key && key.trim().length > 0) return true;
    if (window.__CHRONO_VAULT_KEY__) return true;
  }
  if (typeof import.meta !== "undefined" && import.meta.env?.VITE_CHRONO_VAULT_KEY) {
    return true;
  }
  return false;
}

export function unlockVault(secretKey) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("CHRONO_VAULT_KEY", secretKey);
    window.dispatchEvent(new Event("chrono-vault-changed"));
  }
}

export function lockVault() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("CHRONO_VAULT_KEY");
    window.dispatchEvent(new Event("chrono-vault-changed"));
  }
}

export const MASTER_KITS = [
  {
    "id": "chrono-haze-tau-zero",
    "name": "Chrono-Haze τ-Zero",
    "subtitle": "Flagship Double Dry-Hopped Hazy IPA",
    "style": "New England IPA",
    "category": "Hazy / NEIPA",
    "abv": 6.2,
    "calories": 210,
    "baseTau": 68,
    "somaTau": 1.15,
    "crowdTau": 1.2,
    "defaultUndockTau": 1.2,
    "chillHours": 84,
    "retailPrice": 42,
    "diyCost": 11.5,
    "maltBase": {
      "dmeGrams": 1050,
      "dmeOunces": 37,
      "lmeGrams": 1281,
      "lmeOunces": 45.2,
      "maltType": "800g Extra Light DME + 250g Wheat DME",
      "adjuncts": "120g Quick Oats (steeped 15 min at 155°F) for velvety silk mouthfeel"
    },
    "hopTea": {
      "grams": 15,
      "variety": "Citra & Mosaic",
      "waterVolume": "1.0 L",
      "steepMinutes": 10,
      "temperature": "Simmer 190°F / 88°C",
      "notes": "Low-polyphenol whirlpool extraction for delicate mango and stonefruit backbone."
    },
    "hopper": {
      "grams": 25,
      "variety": "Galaxy & Citra Lupulin Cryo",
      "method": "48h 60mL High-Proof Tincture OR 3.0 mL Quantum Terpene Essence",
      "hopOilMl": 3,
      "notes": "Pure unoxidized myrcene and linalool terpene payload locked under 15 PSI."
    },
    "yeast": {
      "strain": "Lallemand Verdant IPA",
      "grams": 6,
      "brand": "Lallemand",
      "cellCountBillions": 66,
      "attenuation": "75-78%",
      "flocculation": "Medium-Low (Permanent Velvety Haze)",
      "optimumTemp": "68-74°F (20-23°C)"
    },
    "scores": {
      "silk": 9.2,
      "dc": 4,
      "as": 2.5,
      "aroma": 9.4,
      "drag": 0.8,
      "carb": 7.2,
      "buzz": 9.6
    },
    "bioDescription": "Colloidal protein-polyphenol lattice stabilized by Verdant beta-glucans. Robust glutathione (GSH) synthesis combined with 15 PSI isobaric carbonation yields exceptional terpene retention and minimal oxidative degradation.",
    "humanDescription": "The crown jewel of living-rhythm brewing. An avalanche of peach rings, passionfruit, and candied citrus floating on a pillowy cloud of oat-silk with a transcendent, golden fuzzy buzz.",
    "isLocked": false
  },
  {
    "id": "stars-and-stripes",
    "name": "Stars & Stripes",
    "subtitle": "American Pale Ale",
    "style": "American Pale Ale",
    "category": "Pale Ale",
    "abv": 4.7,
    "calories": 176,
    "baseTau": 60,
    "somaTau": 1.15,
    "crowdTau": 1.25,
    "defaultUndockTau": 1.25,
    "chillHours": 84,
    "retailPrice": 34,
    "diyCost": 9.8,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 4,
      "dc": 2,
      "as": 2,
      "aroma": 5.5,
      "drag": 1,
      "carb": 8,
      "buzz": 7.2
    },
    "bioDescription": "Balanced attenuation with low diacetyl retention. Rapid flocculation during the 84h cold lock creates a crisp, low-polyphenol baseline with moderate terpene release.",
    "humanDescription": "The classic backyard porch crusher. Snappy pine and citrus aroma, clean cracker malt, and a bright refreshing fizz that leaves your palate clean and refreshed.",
    "isLocked": true
  },
  {
    "id": "brewgooder-hazy-ipa",
    "name": "Brewgooder Hazy IPA",
    "subtitle": "Tropical Hazy IPA",
    "style": "Tropical Hazy IPA",
    "category": "Hazy / NEIPA",
    "abv": 5,
    "calories": 192,
    "baseTau": 68,
    "somaTau": 1.15,
    "crowdTau": 1.2,
    "defaultUndockTau": 1.2,
    "chillHours": 84,
    "retailPrice": 38,
    "diyCost": 11.2,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 8.5,
      "dc": 4.5,
      "as": 3,
      "aroma": 8.5,
      "drag": 1,
      "carb": 7,
      "buzz": 9.1
    },
    "bioDescription": "High colloidal protein-polyphenol haze stabilized by Verdant beta-glucans. Robust glutathione (GSH) retention creates high Soma-Index with lush lipid mouthfeel.",
    "humanDescription": "Tropical fruit juice in beer form. Unbelievably silky, mango-creamsicle vibes, glowing with feel-good B-vitamins and zero harsh bitterness.",
    "isLocked": true
  },
  {
    "id": "brewdog-hazy-jane",
    "name": "BrewDog Hazy Jane",
    "subtitle": "New England IPA",
    "style": "New England IPA",
    "category": "Hazy / NEIPA",
    "abv": 6,
    "calories": 224,
    "baseTau": 74,
    "somaTau": 1.15,
    "crowdTau": 1.2,
    "defaultUndockTau": 1.2,
    "chillHours": 84,
    "retailPrice": 42,
    "diyCost": 12.4,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 9,
      "dc": 5,
      "as": 3.5,
      "aroma": 9.2,
      "drag": 1.5,
      "carb": 6.5,
      "buzz": 9.4
    },
    "bioDescription": "Exceptional G4 virgin daughter cell suspension supported by oat beta-glucan scaffolding. Diacetyl cushion maintains rich butterscotch micro-layer buffering ethanol burn.",
    "humanDescription": "The velvet smoothie of IPAs. Big cloudy pour, peach rings and guava aroma, super gentle carbonation that glides effortlessly down your throat.",
    "isLocked": true
  },
  {
    "id": "appalachian-mtn-tropical-ipa",
    "name": "Appalachian Mtn. Tropical IPA",
    "subtitle": "Mountain High Tropical IPA",
    "style": "Tropical IPA",
    "category": "IPA",
    "abv": 6.5,
    "calories": 238,
    "baseTau": 76,
    "somaTau": 1.15,
    "crowdTau": 1.25,
    "defaultUndockTau": 1.25,
    "chillHours": 96,
    "retailPrice": 40,
    "diyCost": 11.8,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 7,
      "dc": 4,
      "as": 4,
      "aroma": 9,
      "drag": 1.5,
      "carb": 7.5,
      "buzz": 8.6
    },
    "bioDescription": "High esterification kinetics with El Dorado ketone precursors. Extended 96h cold phase precipitates heavy polyphenols while preserving dissolved monoterpene fractions.",
    "humanDescription": "Tropical mountain fresh air in a glass. Candied pineapple, stone fruit, and bright mountain pine with a satisfying, warm buzzy glow.",
    "isLocked": true
  },
  {
    "id": "fourpure-citrus-ipa",
    "name": "Fourpure Citrus IPA",
    "subtitle": "Zesty Blood Orange & Citrus IPA",
    "style": "Citrus IPA",
    "category": "IPA",
    "abv": 5.9,
    "calories": 218,
    "baseTau": 70,
    "somaTau": 1.15,
    "crowdTau": 1.25,
    "defaultUndockTau": 1.25,
    "chillHours": 84,
    "retailPrice": 38,
    "diyCost": 11.5,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 6.5,
      "dc": 3.5,
      "as": 4.5,
      "aroma": 8.2,
      "drag": 1.2,
      "carb": 8,
      "buzz": 8.4
    },
    "bioDescription": "Limonene terpene synergies enhance perceived carbonic velocity. Controlled phenolic drag ensures rapid palate cleansing post-swallow.",
    "humanDescription": "Sun-drenched citrus orchard snap! Tangerine, sweet orange, and zesty grapefruit with lively champagne fizz and an uplifting finish.",
    "isLocked": true
  },
  {
    "id": "space-hopper-west-coast-ipa",
    "name": "Space Hopper West Coast IPA",
    "subtitle": "Double IPA / West Coast DIPA",
    "style": "Double IPA",
    "category": "IPA",
    "abv": 7,
    "calories": 258,
    "baseTau": 72,
    "somaTau": 1.2,
    "crowdTau": 1.3,
    "defaultUndockTau": 1.3,
    "chillHours": 96,
    "retailPrice": 42,
    "diyCost": 12.8,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 5,
      "dc": 2.5,
      "as": 2.5,
      "aroma": 9.5,
      "drag": 2,
      "carb": 8.5,
      "buzz": 7.8
    },
    "bioDescription": "High ethanol concentration buffered by dextrose attenuation. 15 PSI pressure cap inhibits fusel (higher alcohol) formation while preserving resinous humulene.",
    "humanDescription": "Pure West Coast rocket fuel. Pine trees, sticky resin, and grapefruit peel that grabs your tongue and delivers a bold, warming kick.",
    "isLocked": true
  },
  {
    "id": "razz-session-sour",
    "name": "Razz Session Sour",
    "subtitle": "Raspberry Sour Ale",
    "style": "Sour Ale",
    "category": "Sour",
    "abv": 4.5,
    "calories": 168,
    "baseTau": 64,
    "somaTau": 1.1,
    "crowdTau": 1.15,
    "defaultUndockTau": 1.15,
    "chillHours": 72,
    "retailPrice": 38,
    "diyCost": 10.5,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 4.5,
      "dc": 1.5,
      "as": 7.5,
      "aroma": 6,
      "drag": 0.5,
      "carb": 9,
      "buzz": 7.5
    },
    "bioDescription": "Biological lactic acid synthesis dropping pH to 3.2–3.4. High acetaldehyde spark delivers crisp organic acid pop without harsh astringency.",
    "humanDescription": "Electric pink sour candy rush! Super tart raspberry snap, champagne-level fizz, and a mouth-watering thirst quencher that leaves you craving another sip.",
    "isLocked": true
  },
  {
    "id": "en-casa-mexican-lager",
    "name": "En Casa Mexican Lager",
    "subtitle": "Crisp Mexican Style Cerveza",
    "style": "Mexican Lager",
    "category": "Lager",
    "abv": 4.5,
    "calories": 165,
    "baseTau": 96,
    "somaTau": 1.3,
    "crowdTau": 1.4,
    "defaultUndockTau": 1.4,
    "chillHours": 168,
    "retailPrice": 34,
    "diyCost": 9.5,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 2,
      "dc": 1,
      "as": 1.5,
      "aroma": 4,
      "drag": 0.5,
      "carb": 9.5,
      "buzz": 5.2
    },
    "bioDescription": "Complete diacetyl reduction during extended 168h cold lagering. Stokes settling eliminates particulate matter, yielding low suspension density.",
    "humanDescription": "Ice-cold Mexican beach cerveza. Ultra clean, whisper-light corn crunch, high sparkling bubbles, and a faint kiss of fresh lime.",
    "isLocked": true
  },
  {
    "id": "sunlit-lager",
    "name": "Sunlit Lager",
    "subtitle": "Golden Munich-Style Helles Lager",
    "style": "Helles / Golden Lager",
    "category": "Lager",
    "abv": 5,
    "calories": 182,
    "baseTau": 104,
    "somaTau": 1.35,
    "crowdTau": 1.45,
    "defaultUndockTau": 1.45,
    "chillHours": 240,
    "retailPrice": 34,
    "diyCost": 9.8,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 1.5,
      "dc": 1,
      "as": 1,
      "aroma": 4.5,
      "drag": 0.5,
      "carb": 10,
      "buzz": 4.8
    },
    "bioDescription": "Maximum sedimentation coefficient driven by 240h physical cold lock. Zero diacetyl cushion with micro-laminar carbonation structure.",
    "humanDescription": "Pure Munich beer hall perfection. Brilliant golden clarity, soft honeyed bread crust, tiny tight champagne bubbles, and absolute crispness.",
    "isLocked": true
  },
  {
    "id": "golden-grove-belgian-wit",
    "name": "Golden Grove Belgian Wit",
    "subtitle": "Classic Spiced Witbier",
    "style": "Belgian Witbier",
    "category": "Wheat / Wit",
    "abv": 4.8,
    "calories": 180,
    "baseTau": 62,
    "somaTau": 1.15,
    "crowdTau": 1.2,
    "defaultUndockTau": 1.2,
    "chillHours": 72,
    "retailPrice": 36,
    "diyCost": 10.2,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 8,
      "dc": 3,
      "as": 4,
      "aroma": 7.5,
      "drag": 1,
      "carb": 8.5,
      "buzz": 9
    },
    "bioDescription": "High biological suspension of 4-vinyl guaiacol (clove) and linalool (coriander). Stable daughter cell cloud yields high bioavailable B-vitamin titer.",
    "humanDescription": "Cloudy, sunshine-yellow Belgian wheat ale. Aromas of cracked coriander, sweet orange peel, and fresh dough, with a pillowy, soft mouthfeel.",
    "isLocked": true
  },
  {
    "id": "brewdog-punk-ipa",
    "name": "BrewDog Punk IPA",
    "subtitle": "The Original Post-Modern Classic",
    "style": "American IPA",
    "category": "IPA",
    "abv": 5.4,
    "calories": 202,
    "baseTau": 68,
    "somaTau": 1.15,
    "crowdTau": 1.25,
    "defaultUndockTau": 1.25,
    "chillHours": 84,
    "retailPrice": 40,
    "diyCost": 11.4,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 5.5,
      "dc": 2.5,
      "as": 3,
      "aroma": 8.5,
      "drag": 1.2,
      "carb": 8,
      "buzz": 8
    },
    "bioDescription": "Balanced attenuation with high terpene preservation under 15 PSI. Moderate phenolic trub separation achieved with conical filter installed.",
    "humanDescription": "Bursting with grapefruit, tropical pineapple, and pine needle crunch. A sharp bitter bite that snaps clean, leaving you buzzed and happy.",
    "isLocked": true
  },
  {
    "id": "brewdog-elvis-juice",
    "name": "BrewDog Elvis Juice",
    "subtitle": "Grapefruit Infused IPA",
    "style": "Fruit IPA",
    "category": "IPA",
    "abv": 6.5,
    "calories": 235,
    "baseTau": 74,
    "somaTau": 1.15,
    "crowdTau": 1.25,
    "defaultUndockTau": 1.25,
    "chillHours": 96,
    "retailPrice": 42,
    "diyCost": 12,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 6,
      "dc": 3,
      "as": 4,
      "aroma": 9.5,
      "drag": 1.5,
      "carb": 8,
      "buzz": 8.2
    },
    "bioDescription": "Exogenous nootkatone terpenes pair with native hop oils. Pressure retention prevents volatile aroma loss during secondary carbonation.",
    "humanDescription": "Tart, juicy grapefruit explosion backed by sticky pine and caramel malt. Like biting into a fresh ruby red grapefruit dipped in hop syrup.",
    "isLocked": true
  },
  {
    "id": "lagunitas-super-cluster",
    "name": "Lagunitas Super Cluster",
    "subtitle": "Mega-Ale / Citra Imperial IPA",
    "style": "Imperial IPA",
    "category": "IPA",
    "abv": 8,
    "calories": 288,
    "baseTau": 82,
    "somaTau": 1.25,
    "crowdTau": 1.35,
    "defaultUndockTau": 1.35,
    "chillHours": 120,
    "retailPrice": 46,
    "diyCost": 13,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 6,
      "dc": 3,
      "as": 2.5,
      "aroma": 9.8,
      "drag": 2,
      "carb": 8,
      "buzz": 8.1
    },
    "bioDescription": "High gravity kinetic profile with increased ethanol osmotic stress. Maintained under 15 PSI to avoid fusel off-flavors, requiring 120h cold lock for trub settling.",
    "humanDescription": "A monster 8% Citra bomb that drinks smoother than it has any right to. Giant wave of mango, tangerine, and warm golden euphoria.",
    "isLocked": true
  },
  {
    "id": "lagunitas-sumpin-easy",
    "name": "Lagunitas Sumpin' Easy",
    "subtitle": "Smooth Wheat Pale Ale",
    "style": "Wheat Pale Ale",
    "category": "Pale Ale",
    "abv": 5.7,
    "calories": 210,
    "baseTau": 66,
    "somaTau": 1.15,
    "crowdTau": 1.2,
    "defaultUndockTau": 1.2,
    "chillHours": 84,
    "retailPrice": 38,
    "diyCost": 10.8,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 7.5,
      "dc": 3.5,
      "as": 3,
      "aroma": 8.5,
      "drag": 1,
      "carb": 7.5,
      "buzz": 8.8
    },
    "bioDescription": "Wheat albumin proteins form colloidal suspension matrix, stabilizing aromatic humulene terpenes while maintaining high live yeast cell count.",
    "humanDescription": "Dangerously easy-drinking wheat ale. Soft as cashmere, packed with ripe peach and orange blossom, leaving you feeling warm, loose, and happy.",
    "isLocked": true
  },
  {
    "id": "great-lakes-burning-river",
    "name": "Great Lakes Burning River",
    "subtitle": "Classic Cleveland Pale Ale",
    "style": "American Pale Ale",
    "category": "Pale Ale",
    "abv": 6,
    "calories": 220,
    "baseTau": 68,
    "somaTau": 1.15,
    "crowdTau": 1.25,
    "defaultUndockTau": 1.25,
    "chillHours": 84,
    "retailPrice": 38,
    "diyCost": 10.6,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 5,
      "dc": 2.5,
      "as": 2,
      "aroma": 7.5,
      "drag": 1.2,
      "carb": 8,
      "buzz": 7.6
    },
    "bioDescription": "Traditional two-row and caramel malt thermal degradation products balance Centennial myrcene-humulene ratio under sealed 15 PSI containment.",
    "humanDescription": "Old-school craft beer perfection. Rich caramel malt backbone meets snappy pine and grapefruit, like drinking in an autumn forest campfire.",
    "isLocked": true
  },
  {
    "id": "snap-pilsner",
    "name": "Snap Pilsner",
    "subtitle": "Crisp Bohemian Pilsner",
    "style": "Bohemian Pilsner",
    "category": "Lager",
    "abv": 4.8,
    "calories": 175,
    "baseTau": 98,
    "somaTau": 1.3,
    "crowdTau": 1.35,
    "defaultUndockTau": 1.35,
    "chillHours": 216,
    "retailPrice": 34,
    "diyCost": 9.6,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 2,
      "dc": 3.5,
      "as": 1.5,
      "aroma": 6,
      "drag": 0.5,
      "carb": 9.5,
      "buzz": 5.5
    },
    "bioDescription": "Permitted trace diacetyl cushion (Dc 3.5) characteristic of authentic Bohemian pilsners. Extended cold lagering achieves near-complete Stokes sedimentation.",
    "humanDescription": "Authentic Prague underground cellar pilsner. Golden straw color, soft spicy floral Saaz hops, subtle hint of butter biscuit, and an exhilarating crisp snap.",
    "isLocked": true
  },
  {
    "id": "hopewell-west-coast-lager",
    "name": "Hopewell West Coast Lager",
    "subtitle": "Cold IPA / Hoppy Modern Lager",
    "style": "Hoppy Lager",
    "category": "Lager",
    "abv": 5.2,
    "calories": 188,
    "baseTau": 92,
    "somaTau": 1.25,
    "crowdTau": 1.35,
    "defaultUndockTau": 1.35,
    "chillHours": 168,
    "retailPrice": 38,
    "diyCost": 10.9,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 2.5,
      "dc": 1.5,
      "as": 2,
      "aroma": 8,
      "drag": 0.8,
      "carb": 9,
      "buzz": 6
    },
    "bioDescription": "Utilizes modern hybrid NovaLager genetics to synthesize zero hydrogen sulfide while fermenting at room temp under 15 PSI. High terpene retention over a bone-dry lager backbone.",
    "humanDescription": "The ultimate hybrid: crisp as an ice-cold lager, but smelling like a fresh tropical IPA. Passionfruit, strawberry gum, and snappy crackery malt.",
    "isLocked": true
  },
  {
    "id": "sport-beer-dunkel",
    "name": "Sport Beer Dunkel",
    "subtitle": "Munich Dark Lager",
    "style": "Munich Dunkel",
    "category": "Lager",
    "abv": 5,
    "calories": 186,
    "baseTau": 100,
    "somaTau": 1.3,
    "crowdTau": 1.4,
    "defaultUndockTau": 1.4,
    "chillHours": 192,
    "retailPrice": 36,
    "diyCost": 10.4,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 4.5,
      "dc": 2.5,
      "as": 1.5,
      "aroma": 4,
      "drag": 0.5,
      "carb": 8.5,
      "buzz": 6.2
    },
    "bioDescription": "High concentration of Maillard reaction melanoidin compounds acting as natural antioxidants. Cold sedimentation clarifies ruby dark wort without stripping roast aromatics.",
    "humanDescription": "Dark, toasted, and deceptively light on its feet! Notes of toasted pumpernickel, dark cocoa, and hazelnut with an easy-drinking, clean lager finish.",
    "isLocked": true
  },
  {
    "id": "dark-matter-dublin-porter",
    "name": "Dark Matter / Dublin Porter",
    "subtitle": "Classic Dry Irish Stout & Porter",
    "style": "Irish Stout / Porter",
    "category": "Stout / Porter",
    "abv": 4.5,
    "calories": 172,
    "baseTau": 64,
    "somaTau": 1.15,
    "crowdTau": 1.25,
    "defaultUndockTau": 1.25,
    "chillHours": 84,
    "retailPrice": 36,
    "diyCost": 9.9,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 7.5,
      "dc": 4,
      "as": 1.5,
      "aroma": 4.5,
      "drag": 1,
      "carb": 6.5,
      "buzz": 8.5
    },
    "bioDescription": "High pyrazine roast compounds from roasted barley. Rapid S-04 sedimentation cleanses suspended tannins while maintaining a lush yeast cell suspension for gastric comfort.",
    "humanDescription": "Jet black with a creamy tan head. Rich espresso, baker's dark chocolate, and a dry, roasted finish that drinks with incredible smoothness.",
    "isLocked": true
  },
  {
    "id": "shadow-and-cream",
    "name": "Shadow & Cream",
    "subtitle": "Irish Cream Stout & Milk Stout",
    "style": "Milk Stout",
    "category": "Stout / Porter",
    "abv": 4.6,
    "calories": 205,
    "baseTau": 64,
    "somaTau": 1.15,
    "crowdTau": 1.2,
    "defaultUndockTau": 1.2,
    "chillHours": 84,
    "retailPrice": 38,
    "diyCost": 10.8,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 9.5,
      "dc": 6,
      "as": 1.5,
      "aroma": 5,
      "drag": 1,
      "carb": 6,
      "buzz": 8.9
    },
    "bioDescription": "Unfermentable lactose disaccharides dramatically increase liquid kinematic viscosity. Diacetyl cushion enhances perceived vanilla-cream lipid richness.",
    "humanDescription": "Decadent chocolate milkshake for adults! Velvet smooth, notes of sweet cream, vanilla bean, and mocha with an ultra-satisfying, mellow body.",
    "isLocked": true
  },
  {
    "id": "deep-shade-coffee-stout",
    "name": "Deep Shade Coffee Stout",
    "subtitle": "Imperial Cold Brew Coffee Stout",
    "style": "Imperial Stout",
    "category": "Stout / Porter",
    "abv": 7,
    "calories": 265,
    "baseTau": 78,
    "somaTau": 1.2,
    "crowdTau": 1.3,
    "defaultUndockTau": 1.3,
    "chillHours": 120,
    "retailPrice": 44,
    "diyCost": 12.5,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 9,
      "dc": 5.5,
      "as": 2,
      "aroma": 8,
      "drag": 1.5,
      "carb": 6.5,
      "buzz": 8.7
    },
    "bioDescription": "Cold-brewed chlorogenic acids extracted without boiling bitter astringency. High ethanol content buffered by dense polysaccharide matrix.",
    "humanDescription": "Big, rich, luxurious imperial coffee stout. Waves of freshly pulled espresso, dark chocolate truffles, and a deep warming soul buzz.",
    "isLocked": true
  },
  {
    "id": "adnams-ghost-ship-trooper",
    "name": "Adnams Ghost Ship / Trooper",
    "subtitle": "Citrus British Amber Pale Ale",
    "style": "British Pale Ale",
    "category": "Pale Ale",
    "abv": 4.5,
    "calories": 168,
    "baseTau": 60,
    "somaTau": 1.15,
    "crowdTau": 1.2,
    "defaultUndockTau": 1.2,
    "chillHours": 72,
    "retailPrice": 36,
    "diyCost": 9.8,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 5,
      "dc": 4.5,
      "as": 2,
      "aroma": 6.5,
      "drag": 1,
      "carb": 7.5,
      "buzz": 7.9
    },
    "bioDescription": "S-04 ester profile synthesizes subtle ethyl hexanoate (apple-anise) balanced by Citra dry hops. Diacetyl rest delivers classic pub-cask conditioning.",
    "humanDescription": "The quintessential British pub ale with a modern twist. Toffee and biscuit malt topped with bright citrus hop sparkle and effortless drinkability.",
    "isLocked": true
  },
  {
    "id": "whole-nine-yards-waltham-cider",
    "name": "Whole Nine Yards / Waltham Cider",
    "subtitle": "Cloudy Farmhouse Hard Cider",
    "style": "Hard Cider",
    "category": "Cider",
    "abv": 5,
    "calories": 170,
    "baseTau": 68,
    "somaTau": 1.15,
    "crowdTau": 1.2,
    "defaultUndockTau": 1.2,
    "chillHours": 72,
    "retailPrice": 36,
    "diyCost": 8.5,
    "maltBase": {
      "dmeGrams": null,
      "dmeOunces": null,
      "lmeGrams": null,
      "lmeOunces": null,
      "maltType": "🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]",
      "adjuncts": "🔒 [GATED RATIO // ENTER VAULT KEY TO DECRYPT]"
    },
    "hopTea": {
      "grams": null,
      "variety": "🔒 [REDACTED BOTANICAL]",
      "waterVolume": "1.0 L",
      "steepMinutes": null,
      "temperature": "🔒 [CLASSIFIED THERMAL PROFILE]",
      "notes": "🔒 [RESTRICTED EXTRACTION VECTOR // KEY REQUIRED]"
    },
    "hopper": {
      "grams": null,
      "variety": "🔒 [REDACTED TERPENE PAYLOAD]",
      "method": "🔒 [RESTRICTED VOLATILE RECOVERY PROTOCOL]",
      "hopOilMl": null,
      "notes": "🔒 [CLASSIFIED DOSING PROTOCOL]"
    },
    "yeast": {
      "strain": "🔒 [CLASSIFIED MICROBIAL STRAIN]",
      "grams": null,
      "brand": "🔒 [COMMERCIAL VAULT]",
      "cellCountBillions": null,
      "attenuation": "🔒 [CLASSIFIED]",
      "flocculation": "🔒 [CLASSIFIED]",
      "optimumTemp": "🔒 [CLASSIFIED]"
    },
    "scores": {
      "silk": 3.5,
      "dc": 1.5,
      "as": 6.5,
      "aroma": 7,
      "drag": 0.2,
      "carb": 9,
      "buzz": 7.4
    },
    "bioDescription": "Direct fermentation of fructose, glucose, and sucrose. 15 PSI pressure containment retains delicate apple esters and high natural carbonic acidity.",
    "humanDescription": "Crisp, cloudy, orchard-fresh hard cider! Crisp green apple snap, champagne-tight effervescence, and an incredibly refreshing, uplifting finish.",
    "isLocked": true
  }
];

// Helper to calculate custom kit cost savings
export function calculateSavings(retail, diy) {
  const savedAmount = Math.max(0, retail - diy);
  const percent = retail > 0 ? ((savedAmount / retail) * 100).toFixed(0) : 0;
  return { savedAmount: savedAmount.toFixed(2), percent };
}
