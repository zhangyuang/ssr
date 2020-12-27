# !/usr/bin/env bash

while getopts "l:c:b:u:" opt; do
  case $opt in
    l) # link
      cd packages/cli && yarn link && cd ../types && yarn link \
      && cd ../../example/spa && yarn link ssr ssr-types && chmod 777 ./node_modules/.bin/ssr
      ;;
    u) # unlink
      cd packages/cli && yarn unlink
      ;;
    c) # clean
      rm -rf yarn.lock package-lock.json node_modules \
      example/spa/node_modules example/spa/yarn.lock example/spa/package-lock.json \
      packages/**/cjs packages/**/esm && npx lerna clean
      ;;
    b) # bootstrap
      yarn && cd example/spa && yarn && yarn build
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done