import autocannon from "autocannon";
import { customAlphabet } from "nanoid";

const nanoId = customAlphabet(
  "123456789abcdefghkmnpqrstuvwxyzABCDEFGHKLMNPQRSTUVWXYZ",
  6
);

const shortenURLCount = 30;
const host = "http://localhost:31494";
// const host = "http://localhost:3000";

const createHashURL = `${host}/api/create`;
// console.log(createHashURL);
const redirectURL = `${host}/`;
let hashes = [];

console.time("Total hash creation time");

const hashesPromises = [...Array(shortenURLCount).keys()].map(async () => {
  const sampleURL = `some-url-${nanoId(6)}`;
  const res = await fetch(createHashURL, {
    body: JSON.stringify({ url: sampleURL }),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await res.json();
});

await Promise.all(hashesPromises).then((results) => {
  console.timeEnd("Total hash creation time");
  hashes = results.map((r) => r.hash);
});

console.log("hashes");
console.log(hashes);

const runStressTestAgainstHash = (hash) => {
  return autocannon({
    url: `${redirectURL}${hash}`,
    connections: 10,
    amount: 1000,
    pipelining: 1,
    // duration: 10,
    method: "GET",
    title: hash,
  });
};

console.time("Total stress time");

const promises = hashes.map((hash) => {
  return runStressTestAgainstHash(hash);
});

Promise.all(promises).then((results) => {
  results.map((r) => {
    console.log(`Title: ${r.title}`);
    console.log({
      "Tiempo total": `${r.duration} s`,
      "Promedio de latencia": `${r.latency.average} ms`,
    });
  });
  console.timeEnd("Total stress time");
});
