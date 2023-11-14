import "dotenv/config";
import express from "express";
import path from 'path';
import { fileURLToPath } from 'url';
import { promises } from "node:dns";
import urls from "./urls.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from "cors";

const app = express();
app.use(cors({optionsSuccessStatus: 200}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

let id = 0;

app.post("/api/shorturl", async (req, res) => {
  const url = req.body.url;
  try {
    let parseURL = new URL(url);
    await promises.lookup(parseURL.hostname);
  } catch(error) {
    return res.json({ error: 'invalid url' });
  }
  id = id + 1;
  urls[id] = url;
  return res.json({
    original_url: url,
    short_url: id
  });
});

app.get("/api/shorturl/:id", (req, res) => {
  const { id } = req.params;
  return res.redirect(urls[id]);
})

const PORT = process.env.PORT ?? 3000;

// listen for requests :)
app.listen(PORT, () => {
  console.log(`Your app is listening on http://127.0.0.1:${PORT}`);
});
