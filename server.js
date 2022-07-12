const { notes } = require("./db/notes.json");
const fs = require("fs");
const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 3001;
const app = express();
//parse incoming data into key value pairs (extended: true means look for nested data)
app.use(express.urlencoded({ extended: true }));
//while parsing use json
app.use(express.json());
//use the files in the public folder (/ happens automatically)
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`API server now on http://localhost:${PORT}/`);
});

//============================================================================================================================

function createNewNote(body, notesArray) {
  //define the inputted data
  const note = body;
  //only pushes to in mem
  notesArray.push(note);
  //below pushes to the json for next time
  //writeFileSync is syncronous v of writeFile.
  //larger data set, async would be better.
  fs.writeFileSync(
    path.join(__dirname, "./db/notes.json"),
    //null means don't edit out existing data. 2 means white space between values
    //its just format and readability
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

function validateNote(note) {
  if (!note.title || typeof note.title !== "string") {
    return false;
  }
  if (!note.text || typeof note.text !== "string") {
    return false;
  }
  return true;
}

// currently deletes properly from json, but html doesn't update. might be fixed with heroku
// also there's another problem but i forgor
// OH when a note is deleted, and then another added, there's a possibility of multiple of one id. should be fine when using sql.
function deleteNote(id, notesArray) {
  //find the note by id
  note = notesArray.filter((note) => note.id === id);
  //filter out the deleted note
  notesArray = notesArray.filter((note) => note.id !== id);
  //update the ole json
  fs.writeFileSync(
    path.join(__dirname, "./db/notes.json"),
    //null means don't edit out existing data. 2 means white space between values
    //its just format and readability
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  // tell the html to update here? ---
  return note;
}

//============================================================================================================================
// API routes

// returns notes db in json format
app.get("/api/notes", (req, res) => {
  let results = notes;
  console.log(req.query);
  res.json(results);
});

// handles new saved notes
app.post("/api/notes", (req, res) => {
  // gives each note an id based on array length
  req.body.id = notes.length.toString();
  // validate the note using function above routes
  if (!validateNote(req.body)) {
    res.status(400).send("The note is not formatted properly.");
  }
  // if its fine, create and add
  else {
    // add note to json file and animals array (see function above routes)
    const newNote = createNewNote(req.body, notes);
    res.json(newNote);
  }
});

app.delete("/api/notes/:id", (req, res) => {
  res.json(req.params);
  //get the id from the req params
  const { id } = req.params;
  //delete the note
  const deletedNote = deleteNote(id, notes);

  res.json(deletedNote);
});

//============================================================================================================================
// HTML routes

//returns notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//wildcard (any non-path) returns index.html. This route goes last in the JS.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});