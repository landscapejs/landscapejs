rm -rf ../landscapejs.github.io/assets
find ../landscapejs.github.io  -maxdepth 1 -type f -not -name '.*' -print0 | xargs -0 rm
cp -R dist/* ../landscapejs.github.io
yes | cp -rf VERSION ../landscapejs.github.io/VERSION

cd ../landscapejs.github.io
git add --all
git commit -m "feat: New version $(cat VERSION)"
git push

echo "\nDone!"
