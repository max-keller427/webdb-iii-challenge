const express = require("express");
const helmet = require("helmet");
const knex = require("knex");

const db = require("./data/dbConfig");

const server = express();

server.use(helmet());
server.use(express.json());

server.get("/api/cohorts", async (req, res) => {
  try {
    const cohorts = await db("cohorts");
    res.status(200).json(cohorts);
  } catch (err) {
    res.status(500).json(err);
  }
});

server.get("/api/cohorts/:id", async (req, res) => {
  try {
    const cohortId = await db("cohorts")
      .where({ id: req.params.id })
      .first();
    res.status(200).json(cohortId);
  } catch (err) {
    res.status(500).json({ message: "Couldnt Find Cohort" });
  }
});

server.get("/api/cohorts/:id/students", (req, res) => {
  db("students")
    .where({ cohort_id: req.params.id })
    .then(students => {
      res.status(200).json({ students });
    })
    .catch(err => {
      res.status(500).json({ message: "Error retrieving students" });
    });
});

server.post("/api/cohorts", async (req, res) => {
  try {
    const [id] = await db("cohorts").insert(req.body);
    const cohort = await db("cohorts")
      .where({ id })
      .first();
    res.status(200).json(cohort);
  } catch (err) {
    res.status(500).json({ message: "Couldnt Add Cohort" });
  }
});

server.put("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .update(req.body);

    if (count > 0) {
      const cohort = await db("cohorts")
        .where({ id: req.params.id })
        .first();
      res.status(200).json(cohort);
    } else {
      res.status(404).json({ message: "Cohort does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error adding Cohort" });
  }
});

server.delete("/api/cohorts/:id", async (req, res) => {
  try {
    const count = await db("cohorts")
      .where({ id: req.params.id })
      .del();

    if (count > 0) {
      const cohort = await db("cohorts")
        .where({ id: req.params.id })
        .first();
      res.status(200).json({ message: "Cohort Deleted" });
    } else {
      res.status(404).json({ message: "Cohort does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error deleting Cohort" });
  }
});

server.listen(4000, () => {
  console.log(`Server Running On Port 4000`);
});
