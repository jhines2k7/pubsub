# clean the build directory
rm build/*

# js transform
node_modules/.bin/webpack

# copy index.html to build directory
cp index.html build

# copy story.json to build directory
cp story.json build

# change the src property of the script tag to app.js
sed -i 's/build\/app.js/app.js/g' build/index.html

# change the url to 'story.json'
sed -i "s/url: '..\/story.json'/url: 'story.json'/g" build/app.js

date; echo;