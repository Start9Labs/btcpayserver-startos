#!/bin/bash

until s6-setuidgid postgres pg_isready --quiet
do
    echo "Waiting for postgres to be ready" >&2
    sleep 10;
done