cd client
npm config set registry https://registry.npm.taobao.org
yarn install && yarn build || { exit 1; }

cd ../

IMAGE_NAME="aggre_reader"

docker build -t $IMAGE_NAME .