#include <WiFi.h>
#include <HTTPClient.h>

const char *ssid = "Iphone 14";
const char *password = "0987654321";
const String serverAddress = "127.0.0.1";
const int serverPort = 5100;

const int microphonePin = 34;  // LM393 Microphone Sound Detection Module pin

String device_id = "ab010";

WiFiClient client;

float latitude = 10.8279133;  
float longitude = 77.0579365; 

unsigned long soundEventStartTime = 0;
bool soundDetected = false;
float peakSoundLevel = 0;
float noiseLevel = 0;
unsigned long durationOfSoundEvents = 0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");

  pinMode(microphonePin, INPUT);
}

void loop() {
  int soundLevel = analogRead(microphonePin);
  noiseLevel = soundLevel;  

  if (soundLevel > 100) {  
    if (!soundDetected) {
      soundDetected = true;
      soundEventStartTime = millis();
      peakSoundLevel = soundLevel;  
    } else {
      if (soundLevel > peakSoundLevel) {
        peakSoundLevel = soundLevel;  
      }
    }
  } else {
    if (soundDetected) {
      soundDetected = false;
      durationOfSoundEvents = millis() - soundEventStartTime;  
      Serial.print("Peak Sound Level: ");
      Serial.println(peakSoundLevel);
      Serial.print("Noise Level: ");
      Serial.println(noiseLevel);
      Serial.print("Duration of Sound Event: ");
      Serial.println(durationOfSoundEvents);

      sendDataToServer(peakSoundLevel, noiseLevel, durationOfSoundEvents);
    }
  }

  if (Serial.available() > 0) {
    char receivedData = Serial.read();
  

    if (receivedData == '1') {
      Serial.println("Sound detected");
    } else if (receivedData == '0') {
      Serial.println("No sound detected");
    }
  }

  delay(2000);  
}

void sendDataToServer(float peakSoundLevel, float noiseLevel, unsigned long durationOfSoundEvents) {
  if (client.connect(serverAddress.c_str(), serverPort)) {
    String payload = "{\"device_id\":\"" + device_id +  ",\"peakSoundLevel\":" + String(peakSoundLevel) +
                     ",\"noiseLevel\":" + String(noiseLevel) + ",\"durationOfSoundEvents\":" + String(durationOfSoundEvents) +"\",\"latitude\":" + String(latitude) + 
                     ",\"longitude\":" + String(longitude) + "}";

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