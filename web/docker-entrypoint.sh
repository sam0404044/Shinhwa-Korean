#!/bin/sh
set -eu

npx prisma db push --skip-generate
node prisma/seed-admin.js

exec "$@"
