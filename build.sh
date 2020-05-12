#!/bin/bash

sudo npm run build
sudo mkdir build/nicepay
sudo mkdir build/mobile/
sudo mkdir -p build/niceid/idVerification
sudo mkdir -p build/niceid/bankVerification
sudo cp -r src/nicepay/* build/nicepay/
sudo cp src/util/nicepayStart.js build/
sudo cp src/util/nicepayStartMobile.js build/mobile
sudo cp -r src/niceid/idVerification/* build/niceid/idVerification
sudo cp -r src/niceid/bankVerification/* build/niceid/bankVerification
sudo cp src/termsandpolicy/*.html build/