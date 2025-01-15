#include <Wire.h>
#include <DHT.h>
#include <Adafruit_HX711.h>
#include <WiFi.h>
#include <HTTPClient.h>

const char *ssid = "Iphone 14";
const char *password = "0987654321";
const String serverAddress = "127.0.0.1";
const int serverPort = 5100;

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

const int ultrasonicTrigPin = 33; // Ultrasonic Sensor Trigger Pin
const int ultrasonicEchoPin = 25; // Ultrasonic Sensor Echo Pin
const int mq2Pin = A0;            // MQ2 Smoke/Fire sensor analog pin
const int loadCellDataPin = 2;    // HX711 Data Pin
const int loadCellClockPin = 3;   // HX711 Clock Pin

String device_id = "ab010";

WiFiClient client;

float latitude = 10.8279133;  
float longitude = 77.0579365;

HX711 scale;

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

  pinMode(ultrasonicTrigPin, OUTPUT);
  pinMode(ultrasonicEchoPin, INPUT);
  
  scale.begin(loadCellDataPin, loadCellClockPin);

  scale.set_scale(2280.f);  
  scale.tare();
}

void loop() {
  float temperature = dht.readTemperature();
  float metersFilled = getBinFillLevel();
  float totalWeight = getWeight();
  bool fireDetected = digitalRead(mq2Pin) == HIGH; 

  Serial.print("Temperature: ");
  Serial.println(temperature);

  Serial.print("Meters Filled: ");
  Serial.println(metersFilled);

  Serial.print("Total Weight: ");
  Serial.println(totalWeight);

  Serial.print("Fire Detected: ");
  Serial.println(fireDetected ? "true" : "false");

  sendDataToServer(totalWeight, metersFilled, fireDetected, temperature);

  if (Serial.available() > 0) {
    char receivedData = Serial.read();
   
    if (receivedData == '1') {
      Serial.println("Trash filled");
    } else if (receivedData == '0') {
      Serial.println("No Trash filled");
    }
  }

  delay(2000);  
}

float getBinFillLevel() {
  digitalWrite(ultrasonicTrigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(ultrasonicTrigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(ultrasonicTrigPin, LOW);
  
  long duration = pulseIn(ultrasonicEchoPin, HIGH);
  float distance = (duration * 0.0343) / 2;  
  float meters = distance / 100.0;  
  return meters;  
}

float getWeight() {
  long reading = scale.get_units(10);  s
  return reading; 
}

void sendDataToServer(float totalWeight, float metersFilled, bool fireDetected, float temperature) {
  if (client.connect(serverAddress.c_str(), serverPort)) {
    String payload = "{\"device_id\":\"" + device_id + ",\"totalWeight\":" + String(totalWeight) +
                     ",\"metersFilled\":" + String(metersFilled) + ",\"fire\":" + String(fireDetected) + 
                     ",\"temperature\":" + String(temperature) +  "\",\"latitude\":" + String(latitude) + 
                     ",\"longitude\":" + String(longitude) +"}";

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