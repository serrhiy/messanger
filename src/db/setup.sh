
psql -U postgres -f install.sql
PGPASSWORD=1111 psql -U trajan -d messanger -f structure.sql
# PGPASSWORD=1111 psql -U trajan -d messanger -f insert.sql
