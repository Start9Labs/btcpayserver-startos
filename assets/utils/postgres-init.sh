#!/bin/bash

if test -f /datadir/postgresql/data/postgresql.conf
then
  echo "postgres already initialized" >&2
else 
  echo "initializing postgres..." >&2
  chmod 777 /datadir
  mkdir -p /datadir/postgresql/data
  chmod 777 /datadir/postgresql
  chown -R postgres:postgres /datadir/postgresql/data
  exec s6-setuidgid postgres /usr/lib/postgresql/13/bin/initdb -D /datadir/postgresql/data 2>&1
  echo "postgres initialization complete" >&2
fi