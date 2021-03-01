#!/bin/bash

set -ea

query() {
    sqlite3 /datadir/btcpayserver/sqlite.db "$*"
}

create_password() {
    ADMIN_USERS=$(query "SELECT \"UserId\" FROM \"AspNetUserRoles\"")
    echo "$ADMIN_USERS"
    ARR=$(echo "$ADMIN_USERS" | readarray -t)
    echo "$ARR"
    LEN="${#ARR[@]}"
    echo "$LEN"
    if [ "$LEN" -gt "1" ]
    then
        echo "More than one admin user exists, please use this account to create a new admin user." >&2
        exit 8
    else
        PW=$(LC_ALL=C tr -dc A-Za-z0-9_\!\@\#\$\%\^\&\*\(\)-+= < /dev/urandom | fold -w ${1:-10} | head -n 1)
        PWS= echo "$PW" | tr -d '\r'
        HASH=$(dotnet /actions/actions.dll $PWS)
        query "UPDATE public.\"AspNetUsers\" SET \"PasswordHash\"=$HASH WHERE \"Id\" = ${ARR[0]}"
        echo "Your new temporary password is: $PWS. Use this to login and reset your password. This password will not be available after you leave this screen."
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

