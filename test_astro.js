const { Body, MakeTime, GeoVector, Ecliptic } = require('astronomy-engine');
const t = MakeTime(new Date());
const sunVec = GeoVector(Body.Sun, t, true);
const sunEcl = Ecliptic(sunVec);
console.log(sunEcl);
