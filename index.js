const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.et2e1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 4000;

app.get('/',(req,res)=>{
  res.send('working..............')
})

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollections = client.db("emaJohnStore").collection("products");
  const orderCollections = client.db("emaJohnStore").collection("orders");
  // perform actions on the collection object
  console.log("database connected");

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    productCollections.insertOne(products).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/products", (req, res) => {
    productCollections.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });
  app.get("/product/:key", (req, res) => {
    productCollections
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  app.post("/productsByKeys", (req, res) => {
    let productkeys = req.body;
    productCollections
      .find({ key: { $in: productkeys } })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });
  app.post("/addOrder", (req, res) => {
    const orders = req.body;
    orderCollections.insertOne(orders).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
});

app.listen(process.env.PORT || port);
