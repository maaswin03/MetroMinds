#include <Wire.h>
#include <DHT.h>
#include <WiFi.h>
#include <HTTPClient.h>

const char *ssid = "Iphone 14";
const char *password = "0987654321";
const String serverAddress = "127.0.0.1";
const int serverPort = 5100;

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const int rainPin = 34;      // YL-83 Rain Sensor pin
const int soilMoisturePin = 36; // Soil Moisture Sensor pin
const int flowSensorPin = 32;  // YF-S201 Flow Sensor pin
const int ultrasonicTrigPin = 33;  // JSN-SR04T Trigger Pin
const int ultrasonicEchoPin = 25;  // JSN-SR04T Echo Pin

String device_id = "ab010";

WiFiClient client;

float latitude = 10.8279133;  
float longitude = 77.0579365; 

volatile int flowPulseCount = 0;  // Flow pulse count

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");

  dht.begin();

  pinMode(rainPin, INPUT);
  pinMode(soilMoisturePin, INPUT);
  pinMode(flowSensorPin, INPUT);
  pinMode(ultrasonicTrigPin, OUTPUT);
  pinMode(ultrasonicEchoPin, INPUT);

  attachInterrupt(digitalPinToInterrupt(flowSensorPin), countFlowPulse, FALLING);
}

void loop() {
  float airTemperature = dht.readTemperature();
  int rainfallIntensity = digitalRead(rainPin);
  int soilMoisture = analogRead(soilMoisturePin);
  float flowRate = calculateFlowRate();
  float waterLevel = getWaterLevel();

  Serial.print("Air Temperature: ");
  Serial.println(airTemperature);
  
  Serial.print("Flow Rate: ");
  Serial.println(flowRate);

  Serial.print("Rainfall Intensity: ");
  Serial.println(rainfallIntensity);

  Serial.print("Soil Moisture: ");
  Serial.println(soilMoisture);

  Serial.print("Water Level: ");
  Serial.println(waterLevel);

  sendDataToServer(airTemperature,flowRate, rainfallIntensity, soilMoisture, waterLevel);

  if (Serial.available() > 0) {
    char receivedData = Serial.read();

    if (receivedData == '1') {
      Serial.println("Flood detected!");
    } else if (receivedData == '0') {
      Serial.println("No flood detected.");
    }
  }

  delay(2000);
}

void countFlowPulse() {
  flowPulseCount++;
}

float calculateFlowRate() {
  float flowRate = (flowPulseCount / 7.5); // Conversion factor for YF-S201 to get L/min
  flowPulseCount = 0;  // Reset pulse count after reading
  return flowRate;
}

float getWaterLevel() {
  digitalWrite(ultrasonicTrigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(ultrasonicTrigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(ultrasonicTrigPin, LOW);
  
  long duration = pulseIn(ultrasonicEchoPin, HIGH);
  float distance = (duration * 0.0343) / 2; 
  return distance;  
}

void sendDataToServer(float airTemperature, int rainfallIntensity, int soilMoisture, float flowRate, float waterLevel) {
  if (client.connect(serverAddress.c_str(), serverPort)) {
    String payload = "{\"device_id\":\"" + device_id + "\",\"latitude\":" + String(latitude) + 
                     ",\"longitude\":" + String(longitude) + ",\"airTemperature\":" + String(airTemperature) +
                     ",\"flowRate\":" + String(flowRate) + ",\"rainfallIntensity\":" + String(rainfallIntensity) + ",\"soilMoisture\":" + String(soilMoisture) +
                      ",\"waterLevel\":" + String(waterLevel) + "}";

    client.print("POST /api/data HTTP/1.1\r\n");
    client.print("Host: ");
    client.print(serverAddress);
    client.print("\r\n");
    client.print("Content-Type: application/json\r\n");
    client.print("Content-Length: ");
    client.print(payload.length());
    client.print("\r\n\r\n");
    client.print(payload);

    Serial.println("Data sent to server");
  } else {
    Serial.println("Connection to server failed");
  }

  client.stop();
  delay(1000);
}