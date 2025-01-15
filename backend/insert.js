import { MongoClient } from "mongodb";

import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

const dbName = "METRO-MINDS";

const data = {
  Noise_data: [
    {
      date: "2025-01-14",
      peakSoundLevel: 85.2,
      noiseLevel: 67.1,
      durationOfSoundEvents: 15.5,
      latitude: 10.8279133,
      longitude: 77.0579365,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 88.1,
      noiseLevel: 70.3,
      durationOfSoundEvents: 18.2,
      latitude: 10.8229001,
      longitude: 77.0504456,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 83.9,
      noiseLevel: 65.7,
      durationOfSoundEvents: 14.0,
      latitude: 10.8234567,
      longitude: 77.0612345,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 89.3,
      noiseLevel: 72.4,
      durationOfSoundEvents: 16.5,
      latitude: 10.8301132,
      longitude: 77.0558242,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 84.6,
      noiseLevel: 68.5,
      durationOfSoundEvents: 13.3,
      latitude: 10.8217765,
      longitude: 77.0629003,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 86.5,
      noiseLevel: 69.8,
      durationOfSoundEvents: 17.0,
      latitude: 10.8286754,
      longitude: 77.0589231,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 90.2,
      noiseLevel: 74.6,
      durationOfSoundEvents: 19.1,
      latitude: 10.8324453,
      longitude: 77.0631214,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 82.4,
      noiseLevel: 64.2,
      durationOfSoundEvents: 12.8,
      latitude: 10.8246458,
      longitude: 77.0548159,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 91.1,
      noiseLevel: 75.3,
      durationOfSoundEvents: 20.0,
      latitude: 10.8267895,
      longitude: 77.0512238,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 84.9,
      noiseLevel: 68.1,
      durationOfSoundEvents: 15.2,
      latitude: 10.8254321,
      longitude: 77.0563346,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 87.3,
      noiseLevel: 71.5,
      durationOfSoundEvents: 18.8,
      latitude: 10.8220197,
      longitude: 77.0532447,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 85.8,
      noiseLevel: 69.3,
      durationOfSoundEvents: 16.7,
      latitude: 10.8279133,
      longitude: 77.0597892,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 88.7,
      noiseLevel: 72.0,
      durationOfSoundEvents: 19.4,
      latitude: 10.8292543,
      longitude: 77.0614527,
    },
    {
      date: "2025-01-14",
      peakSoundLevel: 90.5,
      noiseLevel: 74.9,
      durationOfSoundEvents: 20.2,
      latitude: 10.8304559,
      longitude: 77.0608934,
    },
  ],
};

async function seedData() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);

    for (const [collectionName, documents] of Object.entries(data)) {
      const collection = db.collection(collectionName);
      await collection.insertMany(documents);
      console.log(`Seeded ${collectionName}`);
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await client.close();
  }
}

seedData().catch(console.error);
