#!/bin/bash

# https://github.com/docker-library/postgres/issues/146
until psql -U postgres -h localhost -c "select 1" -d postgres &>/dev/null;
do
  echo "Waiting for postgres to be ready" >&2
  sleep 2;
done