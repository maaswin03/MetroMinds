import { MongoClient, ServerApiVersion } from "mongodb";
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

    const earthquakeData = await Earthquake_monitoring_data.find()
      .limit(30)
      .toArray();

    const noiseData = await Noise_monitoring_data.find().toArray();

    const trafficData = await Traffic_monitoring_data.find().toArray();

    const wasteData = await Waste_monitoring_data.find().toArray();

    const dashboardData = {
      flood: floodData,
      earthquake: earthquakeData,
      noise: noiseData,
      traffic: trafficData,
      waste: wasteData,
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "An error occurred while fetching data." });
  }
});

app.get("/flood_suggestions", async (req, res) => {
  try {
    const data = await flood_monitoring_data.find().limit(30).toArray();

    if (data && data.length > 0) {
      const prompt = `
      Provide a detailed analysis of the flood risk based on the last 30 days of data.
      The following are the flood monitoring records for the past 30 days: ${JSON.stringify(
        data
      )}.
      Review the flood levels, water heights, and any other relevant parameters for each day and provide a comprehensive risk analysis.
      If any flood levels exceed the safe threshold, suggest actions to mitigate the risks and improve flood preparedness. 
      Provide recommendations for flood management and steps to be taken to avoid flooding in critical areas in Paragraph.
    `;

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        res.json({ text });
      } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({
          message: "An error occurred while generating suggestions.",
          error: error.message,
        });
      }
    } else {
      res.status(404).json({
        message: "No data found for the specified username.",
      });
    }
  } catch (error) {
    console.error("Error in /chatbot route:", error);
    res.status(500).json({
      message: "An unexpected error occurred.",
      details: error.message,
    });
  }
});

app.get("/earthquake_suggestions", async (req, res) => {
  try {
    const data = await Earthquake_monitoring_data.find().limit(30).toArray();

    if (data && data.length > 0) {
      const prompt = `
      Provide a detailed analysis of the earthquake risk based on the last 30 days of data.
      The following are the earthquake monitoring records for the past 30 days: ${JSON.stringify(
        data
      )}.
      Review the seismic activity levels, magnitude, and any other relevant parameters for each day and provide a comprehensive risk analysis.
      If any seismic activities exceed the safe threshold, suggest actions to mitigate the risks and improve earthquake preparedness. 
      Provide recommendations for earthquake management and steps to be taken to avoid damage in critical areas in Paragraph.
      `;
    

      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        res.json({ text });
      } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({
          message: "An error occurred while generating suggestions.",
          error: error.message,
        });
      }
    } else {
      res.status(404).json({
        message: "No data found for the specified username.",
      });
    }
  } catch (error) {
    console.error("Error in /chatbot route:", error);
    res.status(500).json({
      message: "An unexpected error occurred.",
      details: error.message,
    });
  }
});

const PORT = process.env.PORT || 5200;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
