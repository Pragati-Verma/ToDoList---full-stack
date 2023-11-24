import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  host:"localhost",
  database: "permalist",
  user: "postgres",
  password: "",
  port: 5432,
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items ORDER BY id;");
  const items = result.rows;
  console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const getTitle = req.body.newItem;
  console.log(getTitle);
  await db.query("INSERT INTO items (title) values ($1);",[getTitle]);
  //items.push({ title: item });
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const getItemId = req.body.updatedItemId;
  const getItemTitle = req.body.updatedItemTitle;
  console.log(getItemId);
  console.log(getItemTitle);
  await db.query("UPDATE items SET title = $1 WHERE id = $2;",[getItemTitle,getItemId]);
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const getItemId = req.body.deleteItemId;
  console.log(getItemId);
  await db.query("DELETE FROM items WHERE id = $1;",[getItemId]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
