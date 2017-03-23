# clean the build directory
if [ -d build-dev ]; then
  rm build-dev/*
fi

if [ ! -d build-dev ]; then
  mkdir build-dev
fi

# js transform
node_modules/.bin/webpack --config=webpack.config-dev.js

date; echo;