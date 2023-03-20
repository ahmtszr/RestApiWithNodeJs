const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());


// We return data in our random arrays
app.get("/outfit", (req, res) => {
    const tops = ["Black", "White", "Orange", "Navy"];
    const jeans = ["Gray", "Dark Grey", "Black", "Navy"];
    const shoes = ["White", "Grey", "Black"];

    res.json({
        top: _.sample(tops),
        jeans: _.sample(jeans),
        shoes: _.sample(shoes)
    });
});


// We fetch content by id
app.get("/comments/:id", async (req, res) => {
    const id = req.params.id;
    let content;

    try {
        content = await fs.readFile(`data/comments/${id}.txt`, "utf-8"); // We read the file containing the comment.
    } catch (err) {
        return res.sendStatus(404);
    }

    // We pass content equal to content variable.
    res.json({
        content: content
    });

});


// We create comments.
app.post("/comments", async (req, res) => {

    const id = uuid();
    const content = req.body.content;

    if (!content) {
        return res.sendStatus(400);
    }
    await fs.mkdir("data/comments", {recursive: true});  // We use it to create a new directory in the project's file system.
    await fs.writeFile(`data/comments/${id}.txt`, content);  // We save the text files we created in the API to the "data/comments" directory.


    // We get json's response by id.
    res.status(201).json({
        id: id
    });
})

app.listen(3000, () => console.log("API Server is running..."));