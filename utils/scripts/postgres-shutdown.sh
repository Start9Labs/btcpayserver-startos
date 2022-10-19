#!/bin/bash

exec s6-setuidgid postgres /usr/lib/postgresql/13/bin/pg_ctl -D /datadir/postgresql/data stop 2>&1