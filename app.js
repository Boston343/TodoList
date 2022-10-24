// npm and express includes
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
// import https from "https"; // for forming external get requests

// local includes
import * as date from "./src/date.js";

const app = express();
app.set("view engine", "ejs"); // using EJS
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true })); // this is for parsing data from html form

// __dirname is only available with CJS. Since I am using ESM I need to get it another way
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// static items like other js or css files will not load unless you define where the server should
//      start looking for those files.
app.use(express.static(path.join(__dirname, "/public")));

// -----------------------------------------------------------------------------------
// ------------------------------- Mongoose Setup ------------------------------------
// -----------------------------------------------------------------------------------
// connect to MongoDB
mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true,
});

// schema
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please type something in for your item name."],
    },
});

// model: mongoose will auto make it plural "items"
const Item = mongoose.model("Item", itemSchema);

// -----------------------------------------------------------------------------------
// testing

// remove all items
const deleted = await Item.deleteMany({});
if (deleted.deletedCount >= 1) {
    console.log("Deleted " + deleted.deletedCount + " items.");
} else {
    console.log("ERROR in deleting items. No items deleted.");
}

// async version
// Item.deleteMany({}, (err, ret) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Deleted " + ret.deletedCount + " items.");
//     }
// });

const item1 = new Item({
    name: "Welcome to your todo list!",
});

const item2 = new Item({
    name: "Hit the + button to add a new item.",
});

const item3 = new Item({
    name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

// insert test items into db
// synchronous version
// const inserted = await Item.insertMany(defaultItems);
// console.log(inserted);

// async version
Item.insertMany(defaultItems, (err, items) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Inserted: " + items);
    }
});

// global variables
const items = [];
const workItems = [];

// -----------------------------------------------------------------------------------
// ---------------------------------- Listening --------------------------------------
// -----------------------------------------------------------------------------------
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// -----------------------------------------------------------------------------------
// --------------------------------- Get Requests ------------------------------------
// -----------------------------------------------------------------------------------
// normal page for the day
app.get("/", (req, res) => {
    console.log("Server is up and running.");

    let day = date.getDate();
    Item.find((err, items) => {
        if (err) {
            console.log(err);
        } else {
            res.render("list", { listTitle: day, items: items });
        }
    });
});

// -----------------------------------------------------------------------------------
// page for a workday
app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", items: workItems });
});

// -----------------------------------------------------------------------------------
// about me page
app.get("/about", (req, res) => {
    res.render("about", {});
});

// -----------------------------------------------------------------------------------
// -------------------------------- Post Requests ------------------------------------
// -----------------------------------------------------------------------------------
//  add new item to Todo List
app.post("/newItem", (req, res) => {
    if (req.body.list === "Work List") {
        workItems.push(req.body.newItem);
        console.log("new work item: " + req.body.newItem);
        res.redirect("/work");
    } else {
        items.push(req.body.newItem);
        console.log("new item: " + req.body.newItem);
        res.redirect("/");
    }
});
