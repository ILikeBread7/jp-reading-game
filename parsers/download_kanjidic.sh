#!/bin/bash

if [ -d "parsers" ]; then
    cd "parsers"
fi

wget -P /tmp http://ftp.edrdg.org/pub/Nihongo/kanjidic2.xml.gz
gunzip /tmp/kanjidic2.xml.gz
mv /tmp/kanjidic2.xml ./

rm -f kanjidex.json
node kanjidic_xml_parser.js
node kanjidic_json_parser.js $1