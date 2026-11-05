#!/bin/sh
set -eu

npx prisma db push --skip-generate
node prisma/seed-admin.js
node prisma/seed-test-course.js
node prisma/seed-official-quiz.js

exec "$@"
