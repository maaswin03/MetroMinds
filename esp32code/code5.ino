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

const int infraredPin = 34;       
const int ultrasonicTrigPin = 33;  
const int ultrasonicEchoPin = 25; 

String device_id = "ab010";

WiFiClient client;

float latitude = 10.8279133;  
float longitude = 77.0579365; 

int vehicleCount = 0;
float trafficDensity = 0.0;
float trafficLevel = 0.0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");

  pinMode(infraredPin, INPUT);
  pinMode(ultrasonicTrigPin, OUTPUT);
  pinMode(ultrasonicEchoPin, INPUT);
}

void loop() {
  vehicleCount = detectVehicles();
  trafficDensity = calculateTrafficDensity();
  trafficLevel = calculateTrafficLevel();

  Serial.print("Vehicle Count: ");
  Serial.println(vehicleCount);

  Serial.print("Traffic Density: ");
  Serial.println(trafficDensity);

  Serial.print("Traffic Level: ");
  Serial.println(trafficLevel);

  sendDataToServer(vehicleCount, trafficDensity, trafficLevel);

  if (Serial.available() > 0) {
    char receivedData = Serial.read();
   
    if (receivedData == '1') {
      Serial.println("Traffic detected");
    } else if (receivedData == '0') {
      Serial.println("No traffic detected");
    }
  }

  delay(2000);  
}

int detectVehicles() {
  int vehicleCount = 0;

  if (digitalRead(infraredPin) == HIGH) {  
    vehicleCount++;
    delay(1000);  
  }
  
  return vehicleCount;
}

float calculateTrafficDensity() {
  digitalWrite(ultrasonicTrigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(ultrasonicTrigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(ultrasonicTrigPin, LOW);
  
  long duration = pulseIn(ultrasonicEchoPin, HIGH);
  float distance = (duration * 0.0343) / 2;  
  float trafficDensity = 100.0 / distance;  
  return trafficDensity;
}

float calculateTrafficLevel() {
  if (vehicleCount > 5) {  // If vehicle count exceeds threshold, high traffic level
    return 3.0;  // High traffic
  } else if (vehicleCount > 2) {
    return 2.0;  // Medium traffic
  } else {
    return 1.0;  // Low traffic
  }
}

void sendDataToServer(int vehicleCount, float trafficDensity, float trafficLevel) {
  if (client.connect(serverAddress.c_str(), serverPort)) {
    String payload = "{\"device_id\":\"" + device_id + ",\"vehicleCount\":" + String(vehicleCount) +
                     ",\"trafficDensity\":" + String(trafficDensity) + ",\"trafficLevel\":" + String(trafficLevel) + + "\",\"latitude\":" + String(latitude) + 
                     ",\"longitude\":" + String(longitude)+"}";

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