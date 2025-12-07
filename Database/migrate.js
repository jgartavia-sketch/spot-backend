const db = require("./db");



// Agregar nuevas columnas si no existen
db.serialize(() => {
  console.log("🚧 Ejecutando migraciones...");

  db.run(
    `ALTER TABLE reservas ADD COLUMN estado TEXT DEFAULT 'pendiente'`,
    (err) => {
      if (!err) console.log("✔ Columna 'estado' agregada");
    }
  );

  db.run(
    `ALTER TABLE reservas ADD COLUMN fecha_creada TEXT`,
    (err) => {
      if (!err) console.log("✔ Columna 'fecha_creada' agregada");
    }
  );

  db.run(
    `ALTER TABLE reservas ADD COLUMN fecha_actualizada TEXT`,
    (err) => {
      if (!err) console.log("✔ Columna 'fecha_actualizada' agregada");
    }
  );
});
