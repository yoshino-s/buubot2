#!/bin/sh

cd /app
CLASSPATH=./libs/* java net.mamoe.mirai.console.pure.MiraiConsolePureLoader --no-console &

while true; do sleep 10000; done