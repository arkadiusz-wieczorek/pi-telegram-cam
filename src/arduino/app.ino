// // MX-05V
// #include <VirtualWire.h>

// state for led
const int ledPin = 13;
int ledState = LOW;
unsigned long previousMillis = 0;
long interval_led = 1000;

// state for hc-sr04
#define trig 8
#define echo 7
unsigned long previousMillis_trig = 0;
const long interval_trig = 2000;

// state for sw-420
#define vibrPin 3
unsigned long previousMillis_vibr = 0;
const long interval_vibr = 1000;

// state for hc-sr501
#define inputPirPin 2
int pirState = LOW;
int pirPinStatus;
unsigned long previousMillis_pir = 0;
const long interval_pir = 500;

void setup() {
    Serial.begin(115200);

    pinMode(trig, OUTPUT);
    pinMode(echo, INPUT);
    pinMode(ledPin, OUTPUT);
    pinMode(vibrPin, INPUT);
    pinMode(inputPirPin, INPUT);
}

void loop() {
    setLedState();
    checkVibration();
    checkMotion();
    checkDistance();
}

void setLedState() {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval_led) {
        previousMillis = currentMillis;

        if (ledState == LOW) {
            ledState = HIGH;
        }
        else {
            ledState = LOW;
        }

        digitalWrite(ledPin, ledState);
    }
}

void checkDistance() {
    unsigned long currentMillis = millis();
    long duration, distance;

    if (currentMillis - previousMillis_trig >= interval_trig) {
        previousMillis_trig = currentMillis;

        digitalWrite(trig, LOW);
        delayMicroseconds(2);
        digitalWrite(trig, HIGH);
        delayMicroseconds(10);
        digitalWrite(trig, LOW);

        duration = pulseIn(echo, HIGH);
        distance = duration * 0.034 / 2;

        // 80cm
        if (distance <= 80) {
            Serial.print("1");
        }
      }
}

void checkVibration() {
    unsigned long currentMillis = millis();
    long measurement;
    measurement = pulseIn(vibrPin, HIGH);

    if (currentMillis - previousMillis_vibr >= interval_vibr) {
        previousMillis_vibr = currentMillis;

        if (measurement > 0) {
            Serial.print("2");
        }
    }
}

void checkMotion() {
    unsigned long currentMillis = millis();
    pirPinStatus = digitalRead(inputPirPin);

    if (currentMillis - previousMillis_pir >= interval_pir) {
        previousMillis_pir = currentMillis;

        if (pirPinStatus == 1) {
            pirState = HIGH;
            Serial.print("3");
        } else if (pirPinStatus == 0 && pirState == HIGH) {
            pirState = LOW;
            // Serial.println("motion end");
        } else if (pirPinStatus == 0 && pirState == LOW || pirPinStatus == 1 && pirState == HIGH) {
			// Serial.println("not changed");
        }
    }
}