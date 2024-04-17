# sudo mkdir -p /var/lib/mongodb1 /var/lib/mongodb2 /var/lib/mongodb3
# sudo mkdir -p /var/log/mongodb
# sudo chown -R $(whoami) /var/lib/mongodb1 /var/lib/mongodb2 /var/lib/mongodb3 /var/log/mongodb

mongod --config mongod1.conf
mongod --config mongod2.conf
mongod --config mongod3.conf
