#!/bin/bash
set -e

echo "This script is currently disabled for safety. Please edit the file to enable it."
exit 0

#cd "$(dirname "$0")/.."

#echo "Working directory set to: $(pwd)"

#ENV_BACKEND="./backend/.env.production.local"
#ENV_FRONTEND="./frontend/.env.production.local"
#COMPOSE_FILE="./docker-compose.balanced.prod.yml"

#if [ ! -f "$ENV_BACKEND" ] || [ ! -f "$ENV_FRONTEND" ]; then
    #echo "Error: One or more .env files not found."
    #echo "Expected: $ENV_BACKEND and $ENV_FRONTEND"
    #exit 1
#fi

#ENV_FLAGS="--env-file $ENV_BACKEND --env-file $ENV_FRONTEND"

# --- Configuration ---
#export VERSION=${VERSION:-0.0.1}
#APP_NAME="backend"
#REPLICAS=2
#MAX_RETRIES=40
#SLEEP_TIME=5

#echo "--- Start blue-green deployment (Version: $VERSION, Target instances: $REPLICAS) ---"

# 1. Check which color is currently running
#if docker ps --format '{{.Names}}' | grep -q "[_-]${APP_NAME}-blue[_-]"; then
    #CURRENT="blue"
    #TARGET="green"
#else
    #CURRENT="green"
    #TARGET="blue"
#fi

#echo "Currently running: $CURRENT. Target color: $TARGET."

# 2. Clean up old target instances
#echo "Clean up old $TARGET instances."
#docker compose -f $COMPOSE_FILE $ENV_FLAGS stop "${APP_NAME}-${TARGET}" || true
#docker compose -f $COMPOSE_FILE $ENV_FLAGS rm -f "${APP_NAME}-${TARGET}" || true

# 3. Get new version
#echo "Build new version for $TARGET: Version: $VERSION."
#docker compose -f $COMPOSE_FILE $ENV_FLAGS build "${APP_NAME}-${TARGET}"

# 4. Start the new target instances
#echo "Starting $REPLICAS instances of ${APP_NAME}-${TARGET}."
#docker compose -f $COMPOSE_FILE $ENV_FLAGS up -d --scale "${APP_NAME}-${TARGET}"=$REPLICAS --no-deps "${APP_NAME}-${TARGET}"

# 5. Waiting for "healthy" status of all instances
#echo "Waiting for healthy status of $REPLICAS instances of ${APP_NAME}-${TARGET}."
#for i in $(seq 1 $MAX_RETRIES); do

    #HEALTHY=$(docker ps \
        #--filter "name=${APP_NAME}-${TARGET}" \
        #--filter "health=healthy" \
        #--format "{{.Names}}" | wc -l)

    #echo "Status: $HEALTHY/$REPLICAS healthy:  try $i/$MAX_RETRIES."

    #if [ "$HEALTHY" -eq "$REPLICAS" ]; then
        #echo "All $REPLICAS instances of $TARGET are healthy!"
        #break
    #fi

    #if [ $i -eq $MAX_RETRIES ]; then
        #echo "Timeout: Only $HEALTHY of $REPLICAS instances are healthy. Aborting."
        #echo "Rollback: stopping $TARGET"
        #docker compose -f $COMPOSE_FILE $ENV_FLAGS stop "${APP_NAME}-${TARGET}"
        #docker compose -f $COMPOSE_FILE $ENV_FLAGS rm -f "${APP_NAME}-${TARGET}"
        #exit 1
    #fi

    #sleep $SLEEP_TIME
#done

# 6. Switch traffic (nginx-proxy handles this automatically)
#echo "Switching traffic to $TARGET."
#sleep 5

# 7. Stop the old instances
#echo "Deployment successful. Stopping old instance ($CURRENT)."
#docker compose -f $COMPOSE_FILE $ENV_FLAGS stop "${APP_NAME}-${CURRENT}"

#echo "--- Blue-green deployment completed ---" ]