#!/bin/bash

PKG_VERSION=$1
ARR=($(awk -F. '{$1=$1} 1' <<< $PKG_VERSION))
LEN="${#ARR[@]}"

if (( $LEN >= 4 )); then
  RES=$(sed 's/.[[:xdigit:]]$//' <<< $PKG_VERSION)
  echo $RES
else
  echo $PKG_VERSION
fi