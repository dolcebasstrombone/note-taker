const { notes } = require("./db/notes.json");
const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`API server now on http://localhost:${PORT}/`);
});

//============================================================================================================================
//routes for html go here

// * `GET /notes` should return the `notes.html` file.
app.get("/notes", (req, res) => {
  res.json("/notes will return notes.html.");
});

// * `GET *` should return the `index.html` file.
// app.get("*", (req, res) => {
//   res.json("Wildcard will return index.html.");
// });

//============================================================================================================================
//route for API go here

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
  let results = notes;
  console.log(req.query);
  res.json(results);
});

//============================================================================================================================
// POST /api/notes should receive a new note to save on the request body, add it to the
// db.json file, and then return the new note to the client. You'll need to find a way
// to give each note a unique id when it's saved (look into npm packages that could do
// this for you).
