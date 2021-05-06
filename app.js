//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://mohk_singh:anuj143@cluster0.qimnx.mongodb.net/todolistDB", {
  useNewUrlParser: true, 
  useUnifiedTopology: true
});

const itemsSchema=new mongoose.Schema({
  name: String
});

const Item=mongoose.model("Item", itemsSchema);

const item1=new Item({
  name: "welcome to your todolist"
});

const item2=new Item({
  name: "hit the + button to add a new item"
});

const item3=new Item({
  name: "<-- hit this to delete an item."
});

const defaultItems=[item1, item2, item3];

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err); 
        } else {
          console.log("successfully saved DB");
        }
      });

      res.redirect("/");
    } else {
         res.render("list", {listTitle: "Today", newListItems: foundItems});
         // console.log(foundItems);
    }
  });

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId=(req.body.checkbox);
  Item.findByIdAndRemove(checkedItemId, function(err){
    if(!err){
      console.log("successfully item deleted");
      res.redirect("/");
    }
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
