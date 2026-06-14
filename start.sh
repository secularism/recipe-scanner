
#!/bin/bash

cd /opt/recipe-scanner/apps/api

set -a

source .env

set +a

exec node dist/main.js

