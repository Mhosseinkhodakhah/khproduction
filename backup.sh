#!/bin/bash

BACKUP_DIR="/home/backup/"
DATE=$(date +%F)
DB_NAME="gold_home"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$DATE.dump"

# Ensure the backup directory exists
mkdir -p "$BACKUP_DIR"

pg_dump -U postgres -F c -b -v -f "$BACKUP_FILE" "$DB_NAME"

echo "Backup completed: $BACKUP_FILE"




