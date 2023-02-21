const Buffer = require("buffer").Buffer;
const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  }),
);

const port = process.env.PORT || 3000;
async function urlContentToBase64(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    const encodedString = audioBuffer.toString("base64");
    return encodedString;
  } catch (error) {
    throw new Error("Error-: Audio file can't be encoded");
  }
}

app.post("/", async (req, res) => {
  const audioUrl = req.body?.audioFileUrl;
  if (!audioUrl) return res.status(400).send({ error: "audioFileUrl missing from request body" });

  const encodedString = await urlContentToBase64(audioUrl);
  if (!encodedString)
    return res.status(500).send({ error: "Can't be converted to base64" });

  res.status(200).send({ base64AudioString: encodedString });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
