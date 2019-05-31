exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("students")
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex("students").insert([
        { name: "Max", cohort_id: "1" },
        { name: "Jeff", cohort_id: "2" }
      ]);
    });
};
