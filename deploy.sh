echo "deploying project"
dfx stop
dfx start --clean --background
dfx deploy
