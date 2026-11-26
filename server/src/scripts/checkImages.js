// Check that every starter destination image still loads (photo hosts remove
// images over time, and a dead link shows as a broken card).
//
//   npm run check-images
//
// Not part of `npm test`: it needs the internet, and tests should not.
import destinations from "../data/destinations.js";

let broken = 0;
for (const { name, image } of destinations) {
  const res = await fetch(image, { method: "HEAD" }).catch(() => null);
  if (!res || !res.ok) {
    broken += 1;
    console.log(`BROKEN ${name}: ${res ? res.status : "no response"} ${image}`);
  }
}
console.log(`${destinations.length - broken}/${destinations.length} images load.`);
process.exitCode = broken ? 1 : 0;
