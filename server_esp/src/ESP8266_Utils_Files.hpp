#include <SD.h>

void printDirectorySD(File dir, int numTabs) {
    while (true) {
        File entry = dir.openNextFile();
        if (!entry) {
            // no more files
            break;
        }
        for (uint8_t i = 0; i < numTabs; i++) {
            Serial.print('\t');
        }
        Serial.print(entry.name());
        if (entry.isDirectory()) {
            Serial.println("/");
            printDirectorySD(entry, numTabs + 1);
        } else {
            // files have sizes, directories do not
            Serial.print("\t\t");
            Serial.print(entry.size(), DEC);
            time_t cr = entry.getCreationTime();
            time_t lw = entry.getLastWrite();
            struct tm *tmstruct = localtime(&cr);
            Serial.printf("\tCREATION: %d-%02d-%02d %02d:%02d:%02d",
                          (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1,
                          tmstruct->tm_mday, tmstruct->tm_hour,
                          tmstruct->tm_min, tmstruct->tm_sec);
            tmstruct = localtime(&lw);
            Serial.printf("\tLAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n",
                          (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1,
                          tmstruct->tm_mday, tmstruct->tm_hour,
                          tmstruct->tm_min, tmstruct->tm_sec);
        }
        entry.close();
    }
}

void listFilesSD(File dir, int numTabs, String dirstr) {
    if (dirstr == NULL) {
        dirstr = "/";
    }
    while (true) {
        File entry = dir.openNextFile();
        if (!entry) {
            // no more files
            break;
        }
        // for (uint8_t i = 0; i < numTabs; i++)
        // {
        //   Serial.print('\t');
        // }

        if (entry.isDirectory()) {
            // Serial.println("/");
            listFilesSD(entry, numTabs + 1, dirstr + entry.name() + "/");
        } else {
            Serial.print(dirstr);
            Serial.print(entry.name());
            // files have sizes, directories do not
            Serial.print("\t\t");
            Serial.print(entry.size(), DEC);
            time_t cr = entry.getCreationTime();
            time_t lw = entry.getLastWrite();
            struct tm *tmstruct = localtime(&cr);
            Serial.printf("\tCREATION: %d-%02d-%02d %02d:%02d:%02d",
                          (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1,
                          tmstruct->tm_mday, tmstruct->tm_hour,
                          tmstruct->tm_min, tmstruct->tm_sec);
            tmstruct = localtime(&lw);
            Serial.printf("\tLAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n",
                          (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1,
                          tmstruct->tm_mday, tmstruct->tm_hour,
                          tmstruct->tm_min, tmstruct->tm_sec);
        }
        entry.close();
    }
}

void getFileListSD(File dir, String *json, String dirstr) {
    // File dir = SD.open("/");
    // String dirstr = "/";

    while (true) {
        File entry = dir.openNextFile();
        if (!entry) {
            // no more files
            break;
        }
        if (entry.isDirectory()) {
            getFileListSD(entry, json, dirstr + entry.name() + "/");
        } else {
            // Serial.print(dirstr);
            // Serial.print(entry.name());
            // json = json + dirstr + entry.name();
            json->concat("\"");
            json->concat(dirstr);
            json->concat(entry.name());
            json->concat("\", ");
            // files have sizes, directories do not
            // Serial.print("\t\t");
            // Serial.print(entry.size(), DEC);
            time_t cr = entry.getCreationTime();
            time_t lw = entry.getLastWrite();
            struct tm *tmstruct = localtime(&cr);
            // Serial.printf("\tCREATION: %d-%02d-%02d %02d:%02d:%02d",
            // (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1,
            // tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min,
            // tmstruct->tm_sec);
            tmstruct = localtime(&lw);
            // Serial.printf("\tLAST WRITE: %d-%02d-%02d %02d:%02d:%02d\n",
            // (tmstruct->tm_year) + 1900, (tmstruct->tm_mon) + 1,
            // tmstruct->tm_mday, tmstruct->tm_hour, tmstruct->tm_min,
            // tmstruct->tm_sec);
        }
        entry.close();
    }
}

void getImageListSD(File dir, JsonArray *array, String dirstr) {
    while (true) {
        File entry = dir.openNextFile();
        if (!entry) {
            // no more files
            break;
        }
        if (entry.isDirectory()) {
            getImageListSD(entry, array, dirstr + entry.name() + "/");
        } else {
            String name = String(entry.name());
            String path;
            // Serial.println(name);
            if (name.endsWith(".jpg")) {
                // json->concat("\"");
                path.concat(dirstr);
                path.concat(name);
                path.remove(0, 1);  // remove first "/"
                // json->concat("\", ");
                array->add(path);
            }
        }
        entry.close();
    }
}
