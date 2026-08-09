#!/bin/bash
set -e

COMPOSE_FILE="docker-compose.bluegreen.yml"
PROJECT="hotel-bluegreen"

CURRENT=$(readlink nginx/conf.d/upstream_active.conf | grep -oE 'blue|green')
TARGET=$([ "$CURRENT" == "blue" ] && echo "green" || echo "blue")
echo "Live ตอนนี้: $CURRENT / จะ deploy ไป: $TARGET"

docker-compose -f $COMPOSE_FILE -p $PROJECT up -d --build --wait backend_$TARGET

ln -sf available/upstream_$TARGET.conf nginx/conf.d/upstream_active.conf
docker exec ${PROJECT}-nginx-1 nginx -s reload

echo "สลับไป $TARGET สำเร็จ — $CURRENT idle รอ rollback"