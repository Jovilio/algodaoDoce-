const snmp = require("net-snmp");
const ping = require("ping");
const db = require("./db");

const subnet = "192.168.1.";
const oids = ["1.3.6.1.2.1.43.10.2.1.4.1.1"];

async function checkPrinter(ip) {
  const session = snmp.createSession(ip, "public", { timeout: 1000 });

  return new Promise((resolve) => {
    session.get(oids, (error, varbinds) => {
      session.close();

      if (error) return resolve(null);

      const pageCount = parseInt(varbinds[0].value, 10);

      // Inserir no MySQL
      db.query(
        "INSERT INTO impressoras (ip, pageCount) VALUES (?, ?)",
        [ip, pageCount],
        (err) => {
          if (err) console.error(`Erro ao inserir IP ${ip}:`, err);
        }
      );

      resolve({ ip, pageCount });
    });
  });
}

async function scanNetwork() {
  const promises = [];

  for (let i = 1; i <= 254; i++) {
    const ip = subnet + i;
    promises.push(
      ping.promise.probe(ip, { timeout: 1 }).then((res) => {
        if (res.alive) return checkPrinter(ip);
        return null;
      })
    );
  }

  const results = await Promise.all(promises);
  return results.filter(Boolean);
}

module.exports = scanNetwork;
