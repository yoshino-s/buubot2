#!/bin/sh

cd /app

pkill java

CLASSPATH=./libs/* java net.mamoe.mirai.console.pure.MiraiConsolePureLoader