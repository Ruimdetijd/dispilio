rm -rf node_modules
npm i

npm run build
npm run dist

cp dist/bundle.js docs/dispilio.js
cp node_modules/xmlio/dist/bundle.js docs/xmlio.js

echo -e "\n\n"
read -p "Did you bump the version? (do it now, if you didn't! :))"
next_version=$(node -pe 'require("./package.json").version')
read -p "Bump the version to v$next_version? " anwser
echo -e "\n\n"

if [ "$anwser" == "y" ] || ["$anwser" == ""]; then
	git add .
	git commit -m "Bump to v$next_version"
	git tag "v$next_version"
	git push && git push --tags
	npm publish
fi
