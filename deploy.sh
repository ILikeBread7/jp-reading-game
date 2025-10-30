#!/bin/bash

mkdir -p ui/dicts
sh parsers/download_jmdict.sh prod
sh parsers/download_kanjidic.sh prod