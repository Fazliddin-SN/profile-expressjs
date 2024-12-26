const express = require("express");
const fs = require("fs");
const users = require("./users.json");

const app = express();
const port = 4000;

app.use(express.json());

app.post("/users", (req, res) => {
  const body = req.body;
  fs.readFile("./users.json", (err, data) => {
    if (err) res.status(500).json({ message: "Internal server error" });
    let users = JSON.parse(data);
  });
  const user = { ...body };
  users.push({ ...user, id: users.length + 1 });
  fs.writeFile("./users.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      res
        .sendStatus(500)
        .json({ message: "Internal server error with adding new user" });
    } else {
      res.send({ message: "User added succesfully" });
    }
  });
});

app.get("/users/:id", (req, res) => {
  console.log(req.params);

  const { id } = req.params;
  console.log(id);

  const user = users.filter((user) => user.id === +id);
  res.send(user);
});

app.get("/users", (req, res) => {
  const query = req.query;
  // console.log(query);
  res.send(query);
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;
  fs.readFile("./users.json", (err, data) => {
    if (err) res.status(500).json({ message: "Internal server error" });
    let users = JSON.parse(data);
  });
  const userIndex = users.findIndex((user) => user.id === +id);
  const user = users.filter((user) => user.id === +id);
  // users.splice(userIndex, 1, { ...user[0], ...body });

  fs.writeFile(
    "./users.json",
    JSON.stringify(
      users.splice(userIndex, 1, { ...user[0], ...body }),
      null,
      2
    ),
    (err) => {
      if (err) {
        res
          .sendStatus(500)
          .json({ message: "Internal server error with adding new user" });
      } else {
        res.send({ message: "User changed succesfully" });
      }
    }
  );
});

app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const updatedUsers = users.filter((user) => user.id !== +id);

  res.send(updatedUsers);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
