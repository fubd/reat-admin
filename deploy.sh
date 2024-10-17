#!/bin/bash

SOURCE_DIR="./dist/*"
DEST_USER="root"
DEST_HOST="101.34.88.217"
DEST_DIR="/root/app/admin"

npm run build && scp -r $SOURCE_DIR ${DEST_USER}@${DEST_HOST}:${DEST_DIR}

# 检查传输是否成功
if [ $? -eq 0 ]; then
    echo "文件成功发送到 ${DEST_USER}@${DEST_HOST}:${DEST_DIR}"
else
    echo "文件传输失败"
fi