clean:
	rm -f db.sqlite3

create_database:
	./manage.py migrate --noinput

make_fixtures:
	./manage.py create_groups
	./manage.py create_accounts
	./manage.py createsuperuser --username=root --email=root@example.com --noinput


all: clean create_database make_fixtures