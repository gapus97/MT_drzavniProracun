#!/bin/bash

sudo systemctl enable elasticsearch.service
sudo systemctl start elasticsearch.service
sudo systemctl enable kibana.service
sudo systemctl start kibana.service

# after starting elastic and kibana, move to app and start react application
cd app && npm start
