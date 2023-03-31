#!/bin/bash

(
    cd backend
    npm install
    npm run start &
    cd ../maPremiereAppli
    npx expo export:web
    cd web-build
    npx serve &
    cd ..
    npx cypress run 
    kill -9 $(ps | grep node | awk '{print $1}')
)