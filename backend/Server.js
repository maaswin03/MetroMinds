import  { MongoClient, ServerApiVersion } from "mongodb";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

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
let Noise_monitoring_data;
let Traffic_monitoring_data;
let Waste_monitoring_data;
let User;

async function run() {
  try {
    await client.connect();
    const db = client.db("METRO-MINDS");

    flood_monitoring_data = db.collection("Flood_data");
    Earthquake_monitoring_data = db.collection("Earthquake_data");
    Noise_monitoring_data = db.collection("Noise_data");
    Traffic_monitoring_data = db.collection("Traffic_data");
    Waste_monitoring_data = db.collection("Waste_data");
    User = db.collection("UserInfo");


    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.error("An error occurred:", err);
  }
}

run().catch(console.dir);

app.post("/user/authentication", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      message: "Login successful.",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
});


app.get("/dashboard-data", async (req, res) => {
  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  pastDate.setDate(currentDate.getDate() - 30);

  try {
    const floodData = await flood_monitoring_data.find().limit(30).toArray();

    const earthquakeData = await Earthquake_monitoring_data.find().limit(30).toArray();

    const noiseData = await Noise_monitoring_data.find().toArray();

    const trafficData = await Traffic_monitoring_data.find().toArray();

    const wasteData = await Waste_monitoring_data.find().toArray();

    const dashboardData = {
      flood: floodData,
      earthquake: earthquakeData,
      noise : noiseData,
      traffic : trafficData,
      waste : wasteData
    };

    res.status(200).json(dashboardData);
  } catch (error) {

    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
});


const PORT = process.env.PORT || 5200;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
