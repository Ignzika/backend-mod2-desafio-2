import fs from "fs";
import express from "express";
import morgan from "morgan";
import cors from "cors";
// For ES6 modulo
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors(PORT));
app.use(morgan("dev"));
app.use(express.json()); //permite entender el jason

app.get("/", (req, res) => {
  try {
    res.sendFile(__dirname + "/index.html");
    res.status(200);
  } catch (error) {
    res.json({ message: "el recurso no esta disponible" });
  }
});

app.get("/canciones", (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    res.json(songs);
  } catch (error) {
    res.json({ message: "Cannot READ the jason file" });
  }
});

app.post("/canciones", (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    const cancion = req.body;

    if (Object.values(cancion).some((value) => value == "")) {
      return (
        res.status(400).json({ message: "missing input field" }),
        console.log("missing input field")
      );
    }
    console.log(cancion);
    // canciones.push(cancion), mutate...
    fs.writeFileSync("repertorio.json", JSON.stringify([...songs, cancion]));
    res.send("Added song");
  } catch (error) {
    res.json({
      message:
        "el coso no esta en el cosito... no aguante el impulso de estupidez",
    });
  }
});

app.put("/canciones/:id", (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    const { id } = req.params;
    const index = songs.findIndex((e) => e.id === Number(id));
    const cancion = req.body;

    songs[index] = cancion;

    fs.writeFileSync("repertorio.json", JSON.stringify(songs, (id, value) => {
      if (id === "id") {
        return Number(value);
      }
      return value;
    }
    ));

    console.log(`has been updated`);

    res.json(songs[index]);
  } catch (error) {
    res.json({ message: "Wrong" });
  }
});

app.delete("/canciones/:id", (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    const { id } = req.params;
    const index = songs.findIndex((e) => e.id === Number(id));

    songs.splice(index, 1);

    fs.writeFileSync("repertorio.json", JSON.stringify(songs));

    res.json({ message: "deleted" });
    console.log("Something has been deleted");
  } catch (error) {
    res.json({ message: "Something has gone wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Boss the server is on, on http://localhost:${PORT} ! `);
});
