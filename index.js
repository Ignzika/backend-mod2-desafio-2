import fs from "fs";
import express from "express";
import morgan from "morgan";
import cors from "cors";
// For ES6 modulo
import path from "path";
import { fileURLToPath } from "url";
import { STATUS_CODES } from "http";
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
  } catch (error) {
    res
      .status(500)
      .json({ message: "el recurso no esta disponible" })
      .send("algo paso y no es bonito");
    console.error("something has gone horrible rong");
  }
});

app.get("/canciones", (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    res.json(songs);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Cannot READ the JSON file" })
      .send("Culpa al BackEnd del error");
    console.error("Culpa al BackEnd del error");
  }
});

app.post("/canciones", (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    const cancion = req.body;
    if (Object.values(cancion).some((value) => value == "")) {
      return (
        res
          .status(400)
          .json({ message: "missing input field" }),
        console.error("missing input field")
      );
    }
    // canciones.push(cancion), mutate...
    fs.writeFileSync("repertorio.json", JSON.stringify([...songs, cancion]));
    res.status(201).json(cancion);
    console.log("something... has been added");
  } catch (error) {
    res
      .status(500)
      .json({
        message: "el coso no se puede agregar al cosito que esta en la cosa...", //no aguante el impulso de estupidez
      })
      .send("the thing on the thing is not thinging");
    console.error(
      "el coso no se puede agregar al cosito que esta en la cosa..."
    );
  }
});

app.put("/canciones/:id", (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    const { id } = req.params;
    const index = songs.findIndex((e) => e.id === Number(id));
    const cancion = req.body;

    if (Object.values(cancion).some((value) => value == "")) {
      return (
        res
          .status(400)
          .json({ message: "missing input on edit" }),
        console.error("missing input on the UPDATE")
      );
    }
    songs[index] = cancion;

    fs.writeFileSync(
      "repertorio.json",
      JSON.stringify(songs, (id, value) => {
        if (id === "id") {
          return Number(value);
        }
        return value;
      })
    );

    console.log(`has been updated`);

    res.json(songs[index]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar" })
      .send("update not updated");
    console.error("Update failed...");
  }
});

app.delete("/canciones/:id", (req, res) => {
  try {
    const songs = JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
    const { id } = req.params;
    const index = songs.findIndex((e) => e.id === Number(id));

    songs.splice(index, 1);

    fs.writeFileSync("repertorio.json", JSON.stringify(songs));

    res.json({ message: "deleted song" });
    console.log("Something has been deleted");
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something has gone wrong" })
      .send("search for help!");
    console.error("Error on delete, something wasnt deleted...");
  }
});

app.listen(PORT, () => {
  console.log(`Boss the server is on, on http://localhost:${PORT} ! `);
});
