import { Body, SearchRiseSet, GeoVector, Ecliptic, MakeTime, Observer } from 'astronomy-engine';
import { format } from 'date-fns';

// Constants for Vedic Astrology Calculations
const LAHIRI_AYANAMSA_2026 = 24.13; // Approximate value for 2026

const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
  "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
  "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
];

const NAKSHATRA_NAMES = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashirsha",
  "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha",
  "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati",
  "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
  "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
  "Uttara Bhadrapada", "Revati"
];

const YOGA_NAMES = [
  "Vishkumbha", "Priti", "Ayushman", "Saubhagya", "Shobhana",
  "Atiganda", "Sukarma", "Dhriti", "Shula", "Ganda",
  "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra",
  "Siddhi", "Vyatipata", "Variyana", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma",
  "Indra", "Vaidhriti"
];

const KARANA_NAMES = [
  "Bava", "Balava", "Kaulava", "Taitila", "Gara", "Vanija", "Vishti"
]; // Mobile karanas cycle

const RASHI_NAMES = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
  "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Mina (Pisces)"
];

/**
 * Normalizes an angle to 0-360 degrees
 */
function normalizeAngle(angle: number): number {
  let a = angle % 360;
  if (a < 0) a += 360;
  return a;
}

/**
 * Calculates the local Panchang values for a given date and location
 */
export function calculatePanchang(date: Date, lat = 28.6139, lng = 77.2090) { // Default: New Delhi
  const time = MakeTime(date);
  const observer = new Observer(lat, lng, 0);

  // 1. Get Sayana (Tropical) Longitudes
  const sunVec = GeoVector(Body.Sun, time, true);
  const moonVec = GeoVector(Body.Moon, time, true);
  const sunLongSayana = Ecliptic(sunVec).elon;
  const moonLongSayana = Ecliptic(moonVec).elon;

  // 2. Convert to Nirayana (Sidereal) Longitudes using Lahiri Ayanamsa
  const sunLong = normalizeAngle(sunLongSayana - LAHIRI_AYANAMSA_2026);
  const moonLong = normalizeAngle(moonLongSayana - LAHIRI_AYANAMSA_2026);

  // 3. Tithi Calculation
  const diff = normalizeAngle(moonLong - sunLong);
  const tithiIndex = Math.floor(diff / 12);
  const paksha = tithiIndex < 15 ? "Shukla Paksha" : "Krishna Paksha";
  const tithiName = TITHI_NAMES[tithiIndex];

  // 4. Nakshatra Calculation
  const nakshatraIndex = Math.floor(moonLong / (13 + 1/3));
  const nakshatraName = NAKSHATRA_NAMES[nakshatraIndex];

  // 5. Yoga Calculation
  const sum = normalizeAngle(moonLong + sunLong);
  const yogaIndex = Math.floor(sum / (13 + 1/3));
  const yogaName = YOGA_NAMES[yogaIndex];

  // 6. Karana Calculation
  const karanaIndexFull = Math.floor(diff / 6);
  let karanaName = "";
  if (karanaIndexFull === 0) karanaName = "Kintughna";
  else if (karanaIndexFull === 57) karanaName = "Shakuni";
  else if (karanaIndexFull === 58) karanaName = "Chatushpada";
  else if (karanaIndexFull === 59) karanaName = "Naga";
  else {
    karanaName = KARANA_NAMES[(karanaIndexFull - 1) % 7];
  }

  // 7. Rashi (Moon and Sun Signs)
  const moonRashiIndex = Math.floor(moonLong / 30);
  const sunRashiIndex = Math.floor(sunLong / 30);

  // 8. Rise and Set Times (Approximate using astronomy-engine SearchRiseSet)
  // SearchRiseSet(body, observer, direction, startTime, limitDays)
  // +1 = rise, -1 = set
  
  // We need to set the start time to midnight of the requested date
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const startOfTime = MakeTime(startOfDay);
  
  let sunriseStr = "--:--";
  let sunsetStr = "--:--";
  let moonriseStr = "--:--";
  let moonsetStr = "--:--";
  let rahuKalamStr = "--:--";
  let yamagandaStr = "--:--";
  let gulikaStr = "--:--";
  let auspiciousStr = "--:--";

  try {
    const sunriseSearch = SearchRiseSet(Body.Sun, observer, 1, startOfTime, 1);
    const sunsetSearch = SearchRiseSet(Body.Sun, observer, -1, startOfTime, 1);
    
    const moonriseSearch = SearchRiseSet(Body.Moon, observer, 1, startOfTime, 1);
    const moonsetSearch = SearchRiseSet(Body.Moon, observer, -1, startOfTime, 1);

    const sunriseDate = sunriseSearch ? sunriseSearch.date : null;
    const sunsetDate = sunsetSearch ? sunsetSearch.date : null;

    if (sunriseDate) sunriseStr = format(sunriseDate, "hh:mm a");
    if (sunsetDate) sunsetStr = format(sunsetDate, "hh:mm a");
    if (moonriseSearch) moonriseStr = format(moonriseSearch.date, "hh:mm a");
    if (moonsetSearch) moonsetStr = format(moonsetSearch.date, "hh:mm a");

    // Planetary Hours Calculation
    // Divide daytime (Sunrise to Sunset) into 8 equal parts
    if (sunriseDate && sunsetDate) {
      const dayDurationMs = sunsetDate.getTime() - sunriseDate.getTime();
      const partDurationMs = dayDurationMs / 8;
      
      const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday...

      // Rahu Kalam multiplier (0-based parts of the day)
      // Sun: 7, Mon: 1, Tue: 6, Wed: 4, Thu: 5, Fri: 3, Sat: 2
      const rahuKalamParts = [7, 1, 6, 4, 5, 3, 2];
      const rahuStart = new Date(sunriseDate.getTime() + rahuKalamParts[dayOfWeek] * partDurationMs);
      const rahuEnd = new Date(rahuStart.getTime() + partDurationMs);
      rahuKalamStr = `${format(rahuStart, "hh:mm a")} - ${format(rahuEnd, "hh:mm a")}`;

      // Yamaganda
      // Sun: 4, Mon: 3, Tue: 2, Wed: 1, Thu: 0, Fri: 6, Sat: 5
      const yamaParts = [4, 3, 2, 1, 0, 6, 5];
      const yamaStart = new Date(sunriseDate.getTime() + yamaParts[dayOfWeek] * partDurationMs);
      const yamaEnd = new Date(yamaStart.getTime() + partDurationMs);
      yamagandaStr = `${format(yamaStart, "hh:mm a")} - ${format(yamaEnd, "hh:mm a")}`;

      // Gulika
      // Sun: 6, Mon: 5, Tue: 4, Wed: 3, Thu: 2, Fri: 1, Sat: 0
      const gulikaParts = [6, 5, 4, 3, 2, 1, 0];
      const gulikaStart = new Date(sunriseDate.getTime() + gulikaParts[dayOfWeek] * partDurationMs);
      const gulikaEnd = new Date(gulikaStart.getTime() + partDurationMs);
      gulikaStr = `${format(gulikaStart, "hh:mm a")} - ${format(gulikaEnd, "hh:mm a")}`;

      // Auspicious (Just a placeholder logic, usually Abhijit Muhurat is the 8th part out of 15, we'll use the 4th part out of 8 as an approximation of noon)
      const abhijitStart = new Date(sunriseDate.getTime() + 3.5 * partDurationMs);
      const abhijitEnd = new Date(abhijitStart.getTime() + 1 * partDurationMs); // Actually 1/15th, using approximation
      auspiciousStr = `${format(abhijitStart, "hh:mm a")} - ${format(abhijitEnd, "hh:mm a")}`;
    }

  } catch (error) {
    console.error("Error calculating rise/set times:", error);
  }

  return {
    tithi: `${paksha} ${tithiName}`,
    nakshatra: nakshatraName,
    yoga: yogaName,
    karana: karanaName,
    moonSign: RASHI_NAMES[moonRashiIndex],
    sunSign: RASHI_NAMES[sunRashiIndex],
    sunrise: sunriseStr,
    sunset: sunsetStr,
    moonrise: moonriseStr,
    moonset: moonsetStr,
    rahuKalam: rahuKalamStr,
    yamaganda: yamagandaStr,
    gulika: gulikaStr,
    auspicious: auspiciousStr,
  };
}
