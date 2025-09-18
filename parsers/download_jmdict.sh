#!/bin/bash

if [ -d "parsers" ]; then
    cd "parsers"
fi

wget -P /tmp http://ftp.edrdg.org/pub/Nihongo/JMdict_e.gz
gunzip /tmp/JMdict_e.gz
mv /tmp/JMdict_e ./

rm ui/dicts/*
node dict_xml_parser.js
node new_dict_json_parser.js prod