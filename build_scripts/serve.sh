mkdir ~/tmp;
mkdir ~/tmp/storage;
mkdir ~/tmp/storage/messenger;
dev_appserver.py ../ --admin_port 8081 --storage_path ~/tmp/storage/messenger;
