// ESP8266WebServer server(80);
AsyncWebServer server(80);

// #include "ESP8266_Utils_Server.hpp"

// Function that will be executed in the URI '/'
// void handleRoot()
// {
//    server.send(200, "text/plain", "Hello!");
// }

// Function that will run on unknown URI
// void handleNotFound()
// {
//    server.send(404, "text/plain", "Not found");
// }

bool loadFromSdCard(AsyncWebServerRequest *request) {
    String path = request->url();
    path.remove(0, 7);  // remove "/photos"
    Serial.println(path);
    String dataType = "text/plain";
    struct fileBlk {
        File dataFile;
    };
    fileBlk *fileObj = new fileBlk;

    if (path.endsWith("/")) path += "index.htm";
    if (path.endsWith(".src"))
        path = path.substring(0, path.lastIndexOf("."));
    else if (path.endsWith(".htm"))
        dataType = "text/html";
    else if (path.endsWith(".css"))
        dataType = "text/css";
    else if (path.endsWith(".js"))
        dataType = "application/javascript";
    else if (path.endsWith(".png"))
        dataType = "image/png";
    else if (path.endsWith(".gif"))
        dataType = "image/gif";
    else if (path.endsWith(".jpg"))
        dataType = "image/jpeg";
    else if (path.endsWith(".ico"))
        dataType = "image/x-icon";
    else if (path.endsWith(".xml"))
        dataType = "text/xml";
    else if (path.endsWith(".pdf"))
        dataType = "application/pdf";
    else if (path.endsWith(".zip"))
        dataType = "application/zip";

    fileObj->dataFile = SD.open(path.c_str());
    if (fileObj->dataFile.isDirectory()) {
        path += "/index.htm";
        dataType = "text/html";
        fileObj->dataFile = SD.open(path.c_str());
    }

    if (!fileObj->dataFile) {
        delete fileObj;
        return false;
    }

    if (request->hasParam("download")) dataType = "application/octet-stream";

    // Here is the context problem.  If there are multiple downloads active,
    // we don't have the File handles. So we only allow one active download
    // request at a time and keep the file handle in static.  I'm open to a
    // solution.

    request->_tempObject = (void *)fileObj;
    request->send(
        dataType, fileObj->dataFile.size(),
        [request](uint8_t *buffer, size_t maxlen, size_t index) -> size_t {
            fileBlk *fileObj = (fileBlk *)request->_tempObject;
            size_t thisSize = fileObj->dataFile.read(buffer, maxlen);
            if ((index + thisSize) >= fileObj->dataFile.size()) {
                fileObj->dataFile.close();
                request->_tempObject = NULL;
                delete fileObj;
            }
            return thisSize;
        });
    return true;
}
void handleNotFound(AsyncWebServerRequest *request) {
    String path = request->url();
    if (path.endsWith("/")) path += "index.htm";
    if (loadFromSdCard(request)) {
        return;
    }
    String message = "\nNo Handler\r\n";
    message += "URI: ";
    message += request->url();
    message += "\nMethod: ";
    message += (request->method() == HTTP_GET) ? "GET" : "POST";
    message += "\nParameters: ";
    message += request->params();
    message += "\n";
    for (uint8_t i = 0; i < request->params(); i++) {
        AsyncWebParameter *p = request->getParam(i);
        message += String(p->name().c_str()) + " : " +
                   String(p->value().c_str()) + "\r\n";
    }
    request->send(404, "text/plain", message);
    Serial.println(message);
}

void handleSDlist(AsyncWebServerRequest *request) {
    Serial.println("Serving Photolist...");
    File root = SD.open("/");
    // String json = "";

    const size_t CAPACITY = JSON_ARRAY_SIZE(1024);
    StaticJsonDocument<CAPACITY> doc;
    JsonArray array = doc.to<JsonArray>();

    // DynamicJsonBuffer jsonBuffer;
    // JsonArray &array = jsonBuffer.createArray();
    getImageListSD(root, &array, "/");
    root.close();
    String response = "";
    // array.printTo(response);
    serializeJson(doc, response);
    // json = "[" + json + "]";
    // Serial.println(json);
    // server.send(200, "application/json", json);
    Serial.println(response);
    request->send(200, "application/json", response);
    // request->send(200, "text/plain", "Works!");
}

void InitServer() {
    // Route to '/'
    // server.on("/", handleRoot);

    // server.serveStatic("/", LittleFS, "/");
    server.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");
    // server.serveStatic("/api", SD, "/");

    server.on("/hello", HTTP_GET, [](AsyncWebServerRequest *request) {
        request->send(200, "application/json", "{\"message\":\"Welcome\"}");
    });

    // Routing to '/ inline' using lambda function
    // sync
    // server.on("/inline", []() {
    //    server.send(200, "text/plain", "This works too");
    // });
    // async
    server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
        Serial.println("Works!");
        request->send(200, "text/plain", "Works!");
    });

    server.on("/photolistold", HTTP_GET, handleSDlist);

    // server.on("/image", loadFromSdCard(server.uri()));

    // Route all other URI
    // server.onNotFound(handleNotFound);
    // or
    // server.onNotFound([]() {              // If the client requests any URI
    //    if (!HandleFileRead(server.uri())) // send it if it exists
    //       handleNotFound();               // otherwise, respond with a 404
    //       (Not Found) error
    // });

    server.onNotFound(handleNotFound);

    // server.onNotFound([](AsyncWebServerRequest *request) {
    //     request->send(400, "text/plain", "Not found");
    //     // request->redirect("/index.html");
    // });

    // Start server
    server.begin();
    Serial.println("HTTP server started");
}
