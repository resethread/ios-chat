echo STARTING SCRIPT
# sudo apt-get install git
# sudo apt-get install update
# sudo apt-get install mongodb -y
# sudo apt-get install nodejs -y
# sudo apt-get install npm -y
# npm install pm2 -g
# sudo apt-get install nginx
# sudo apt-get install -g gulp

server {
    listen 80;

    server_name localhost;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
