#!/bin/bash

# Add version to urls to disable browser caching
VERSION=$(git rev-parse --short HEAD)
find ./ui/ \( -type f \( -name "*.js" -o -name "index.html" \) ! -name "*.min.js" \) \
  -exec sed -i -E "
    s|(from ['\"][^'\"]+\.js)(['\"])|\1?v=${VERSION}\2|g;
    s|(script[^>]*src=['\"][^'\"]+\.js)(['\"])|\1?v=${VERSION}\2|g;
    s|(link[^>]*href=['\"][^'\"]+\.css)(['\"])|\1?v=${VERSION}\2|g;
    s|(\.min\.js)\?v=[^'\"> ]+|\1|g;
  " {} +

mkdir -p ui/dicts
sh parsers/download_jmdict.sh prod
sh parsers/download_kanjidic.sh prod