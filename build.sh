cd ./ui_build
npm run-script build && (
    cd ..;
    rm -rf ./server/build
    mv ./ui_build/build ./server/
    cd ./server;
    npm run-script build && cd .. 
) 