# !/usr/bin/env bash

while getopts "l:c:b:u:" opt; do
  case $opt in
    l) # link
      cd packages/cli && yarn link && cd ../../example/spa && yarn link ssr
      ;;
    u) # unlink
      cd packages/cli && yarn unlink
      ;;
    c) # clean
      rm -rf yarn.lock package-lock.json node_modules example/spa/node_modules packages/**/cjs packages/**/esm && npx lerna clean
      ;;
    b) # bootstrap
      yarn && cd example/spa && yarn
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      ;;
  esac
done