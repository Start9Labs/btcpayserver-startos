#!/bin/bash

set -ea

query() {
    sqlite3 /datadir/btcpayserver/sqlite.db "$*"
}

create_password() {
    ADMIN_USERS=$(query "SELECT \"UserId\" FROM \"AspNetUserRoles\"")
    ARR=$(echo "$ADMIN_USERS" | readarray -t)
    LEN="${#ARR[@]}"
    if [ "$LEN" -gt "1" ]
    then
        echo "More than one admin user exists, please use this account to create a new admin user." >&2
        exit 8
    else
        ADMIN=( ${ADMIN_USERS[0]} ); echo ${ADMIN[1]}  
        PW=$(LC_ALL=C tr -dc A-Za-z0-9 < /dev/urandom | fold -w ${1:-10} | head -n 1)
        HASH=$(dotnet /actions/actions.dll "$PW")
        query "UPDATE \"AspNetUsers\" SET \"PasswordHash\"='$HASH' WHERE \"Id\"='$ADMIN'"
        NEWLINE=$'\n'
        echo "Your new temporary password is: ${PW}${NEWLINE}This password will be unavailable for retrieval after you leave the screen."
    fi
}

case "$1" in
    disable-multifactor)
        query "DELETE FROM \"U2FDevices\" WHERE \"ApplicationUserId\" = (SELECT \"Id\" FROM \"AspNetUsers\" WHERE upper('$2') = \"NormalizedEmail\")"
        query "UPDATE public.\"AspNetUsers\" SET \"TwoFactorEnabled\"=false WHERE upper('\$2') = \"NormalizedEmail\""
        ;;
	set-user-admin)
        query "INSERT INTO \"AspNetUserRoles\" Values ( (SELECT \"Id\" FROM \"AspNetUsers\" WHERE upper('$2') = \"NormalizedEmail\"), (SELECT \"Id\" FROM \"AspNetRoles\" WHERE \"NormalizedName\"='SERVERADMIN'))"
        ;;
    reset-server-policy)
        query "DELETE FROM \"Settings\" WHERE \"Id\" = 'BTCPayServer.Services.PoliciesSettings'"
        echo "Registrations are now enabled on your server."
        ;;
    reset-admin-password)
        create_password
        ;;
    *)
        echo "Usage: $0 [command]"
        echo
        echo "Commands:"
        echo "         disable-multifactor <email>"
        echo "         set-user-admin <email>"
        echo "         reset-server-policy"
        echo "         reset-admin password"
esac

exit 0

