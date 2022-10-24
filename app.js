// npm and express includes
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import _ from "lodash";
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

const listSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    items: [itemSchema],
});

// model: mongoose will auto make it plural "items"
const Item = mongoose.model("Item", itemSchema);

const List = mongoose.model("List", listSchema);

// -----------------------------------------------------------------------------------
// testing

// remove all items
// synchronous version
// const deleted = await Item.deleteMany({});
// if (deleted.deletedCount >= 1) {
//     console.log("Deleted " + deleted.deletedCount + " items.");
// } else {
//     console.log("ERROR in deleting items. No items deleted.");
// }

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
// Item.insertMany(defaultItems, (err, items) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("Inserted: " + items);
//     }
// });

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
    // let day = date.getDate();
    let day = "Today";
    Item.find((err, items) => {
        if (err) {
            console.log(err);
        } else {
            if (items.length === 0) {
                // if nothing currently in collection, populate with starting items
                Item.insertMany(defaultItems, (err, insertedItems) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Inserted: " + insertedItems);
                        res.redirect("/"); // reload so we get the items we just inserted
                    }
                });
            } else {
                // if already items in collection, just show them
                res.render("list", { listName: day, items: items });
            }
        }
    });
});

// -----------------------------------------------------------------------------------
// about me page
app.get("/about", (req, res) => {
    res.render("about", {});
});

// -----------------------------------------------------------------------------------
// pages for any other list you want to create
app.get("/:listName", (req, res) => {
    const listName = _.lowerCase(req.params.listName);

    // determine if list already exists
    List.findOne({ name: listName }, (err, foundList) => {
        if (err) {
            console.log(err);
        } else {
            if (!foundList) {
                // list doesn't exists, so create it and then display
                const list = new List({
                    name: listName,
                    items: defaultItems,
                });

                list.save();

                res.redirect("/" + listName);
            } else {
                // list exists, so just display it
                res.render("list", {
                    listName: _.capitalize(foundList.name),
                    items: foundList.items,
                });
            }
        }
    });
});

// -----------------------------------------------------------------------------------
// -------------------------------- Post Requests ------------------------------------
// -----------------------------------------------------------------------------------
//  add new item to Todo List
app.post("/newItem", (req, res) => {
    const listName = _.lowerCase(req.body.list);
    const itemName = req.body.newItem;

    const newItem = new Item({
        name: itemName,
    });

    if (req.body.list === "Today") {
        console.log("new item: " + itemName);

        // add new item into items collection
        newItem.save();

        // reload
        res.redirect("/");
    } else {
        console.log("new item: " + itemName);

        List.findOne({ name: listName }, (err, foundList) => {
            if (err) {
                console.log(err);
            } else {
                foundList.items.push(newItem);
                foundList.save();
            }
        });

        // reload
        res.redirect("/" + listName);
    }
});

// -----------------------------------------------------------------------------------
//  delete an item from Todo List
app.post("/deleteItem", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = _.lowerCase(req.body.listName);

    if (listName === "today") {
        // delete the item is question. Could also use .findByIdAndRemove()
        Item.deleteOne({ _id: checkedItemId })
            .then(() => {
                console.log("Deleted item with _id: " + checkedItemId); // success
            })
            .catch((err) => {
                console.log(err); // failure
            });

        res.redirect("/");
    } else {
        // find list, and delete from list array the specifc item
        List.findOneAndUpdate(
            { name: listName },
            { $pull: { items: { _id: checkedItemId } } },
            (err, foundList) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/" + listName);
                }
            }
        );
    }
});
