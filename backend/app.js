const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let flood_monitoring_data;
let Earthquake_monitoring_data;
let City_sound_monitoring_data;
let Smartbin_monitoring_data;
let Trafficflow_monitoring_data;

async function run() {
  try {
    await client.connect();
    const db = client.db("METRO-MINDS");

    flood_monitoring_data = db.collection("Flood_monitoring");

    Earthquake_monitoring_data = db.collection("Earthquake_monitoring");

    City_sound_monitoring_data = db.collection("City_sound_monitoring");

    Smartbin_monitoring_data = db.collection("Smartbin_monitoring");

    Trafficflow_monitoring_data = db.collection("Trafficflow_monitoring");

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

run().catch(console.dir);

app.post("/flood_monitoring_data", async (req, res) => {
  const device_id = req.body.device_id;

  try {
    const data = await flood_monitoring_data.findOne({ device_id: device_id });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Data not found for this device_id" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.get("/flood_monitoring_data_all", async (req, res) => {
  try {
    const data = await flood_monitoring_data.find({}).toArray(function(err, result) {
      if (err) throw err;
    });

    if (data && data.length > 0) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No data found for the specified criteria." });
    }
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error: error.message });
  }
});



app.post("/Earthquake_monitoring_data", async (req, res) => {
  const device_id = req.body.device_id;

  try {
    const data = await Earthquake_monitoring_data.findOne({
      device_id: device_id,
    });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Data not found for this device_id" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.post("/City_sound_monitoring_data", async (req, res) => {
  const device_id = req.body.device_id;

  try {
    const data = await City_sound_monitoring_data.findOne({
      device_id: device_id,
    });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Data not found for this device_id" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.post("/Smartbin_monitoring_data", async (req, res) => {
  const device_id = req.body.device_id;

  try {
    const data = await Smartbin_monitoring_data.findOne({
      device_id: device_id,
    });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Data not found for this device_id" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.post("/Trafficflow_monitoring_data", async (req, res) => {
  const device_id = req.body.device_id;

  try {
    const data = await Trafficflow_monitoring_data.findOne({
      device_id: device_id,
    });

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Data not found for this device_id" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

const PORT = process.env.PORT || 5100;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
