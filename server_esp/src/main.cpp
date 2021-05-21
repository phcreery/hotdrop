#include <Arduino.h>
#include <ESP8266WiFi.h>
// #include <ESPAsyncWiFiManager.h>
#include <ESP8266mDNS.h>
// #include <ESP8266WebServer.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
// #include <FS.h>   // Include the SPIFFS library // !DEPRECIATED!
#include <LittleFS.h>
#include <SD.h>

#include "config.h"  // Replace with data from your network
#include "ESP8266_Utils.hpp"
#include "ESP8266_Utils_Files.hpp"
#include "ESP8266_Utils_mDNS.hpp"
// #include "ESP8266_Utils_Server.hpp"

#include "Server.hpp"

const int chipSelect = D8;

void setup() {
    Serial.begin(115200);
    Serial.println();

    // FLASH FILE SYSTEM

    if (!LittleFS.begin()) {
        Serial.println("An Error has occurred while mounting LittleFS");
        return;
    }
    Serial.println("Mounted LittleFS");

    Dir dir = LittleFS.openDir("");
    while (dir.next()) {
        Serial.print(dir.fileName());
        Serial.print("\t\t");
        Serial.print(dir.fileSize());
        Serial.println(" b");
    }

    // SD CARD

    Serial.println("Initializing SD card...");
    if (!SD.begin(chipSelect)) {
        Serial.println("An Error has occurred while mounting SD");
        while (true)
            ;
    }
    Serial.println("SD Initialization done.");

    File root = SD.open("/");
    // listFilesSD(root, 0, "/");
    String json;
    getFileListSD(root, &json, "/");
    json = "[" + json + "]";
    Serial.println(json);
    root.close();

    // SERVER

    ConnectWiFi_AP(true);

    // InitMDNS();  // Not working??

    InitServer();
}

void loop() {
    // server.handleClient(); // non-async
}
