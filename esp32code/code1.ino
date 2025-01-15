#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_ADXL345_U.h>
#include <WiFi.h>
#include <HTTPClient.h>

const char *ssid = "Iphone 14";
const char *password = "0987654321";
const String serverAddress = "127.0.0.1";
const int serverPort = 5100;

Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified();

const int strainPin = 35;
const int vibrationPin = 34;

String device_id = "ab010"; 

WiFiClient client;

float latitude = 10.8279;  
float longitude = 77.0605; 

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");

  if (!accel.begin()) {
    Serial.println("No ADXL345 detected");
    while (1);
  }
  Serial.println("ADXL345 sensor initialized");

  pinMode(strainPin, INPUT);
  pinMode(vibrationPin, INPUT);
}

void loop() {
  sensors_event_t event;
  accel.getEvent(&event);

  int strainValue = analogRead(strainPin);
  int vibrationIntensity = analogRead(vibrationPin);

  float acceleration = sqrt(pow(event.acceleration.x, 2) + pow(event.acceleration.y, 2) + pow(event.acceleration.z, 2));

  Serial.print("Acceleration Value: ");
  Serial.println(acceleration);

  Serial.print("Vibration Intensity Value: ");
  Serial.println(vibrationIntensity);

  Serial.print("Strain Gauge Sensor Value: ");
  Serial.println(strainValue);

  if (Serial.available() > 0) {
    char receivedData = Serial.read();

    if (receivedData == '1') {
      Serial.println("Earthquake detected!");
    } else if (receivedData == '0') {
      Serial.println("No earthquake detected.");
    }
  }

  sendDataToServer(acceleration, vibrationIntensity, strainValue);

  delay(2000);
}

void sendDataToServer(float acceleration, int vibrationIntensity, int strainValue) {
  if (client.connect(serverAddress.c_str(), serverPort)) {
    String payload = "{\"device_id\":\"" + device_id + "\",\"latitude\":" + String(latitude) + 
                     ",\"longitude\":" + String(longitude) + ",\"acceleration\":" + String(acceleration) +
                     ",\"vibrationIntensity\":" + String(vibrationIntensity) + ",\"strain\":" + String(strainValue) + "}";

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