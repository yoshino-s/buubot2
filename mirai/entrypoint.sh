#!/bin/sh

if [ $MIRAI_QQ ] && [ $MIRAI_PASSWORD ]; then
  echo "login $MIRAI_QQ $MIRAI_PASSWORD" >> /app/config.txt
fi
if [ $MIRAI_EXTRA_COMMAND ]; then
  echo MIRAI_EXTRA_COMMAND >> /app/config.txt
fi

echo >> /app/config.txt

cat /app/config.txt | java -jar /app/mirai-console-wrapper.jar --update KEEP