echo Packaging with Matthew Pablo music
rm -rf distro/*
mkdir distro/js
mkdir distro/mp3
cp resources/js/adapter.js distro/js
cp resources/js/matthew-pablo.js distro/js/exodus-cfg.js
cp resources/html/index.html distro
cp resources/css/virtualDungeon.css distro
cp resources/mp3/matthew-pablo/* distro/mp3
cd src/js
browserify VirtualDungeon.js -o ../../distro/js/virtualDungeon-min.js
# watchify VirtualDungeon.js -o ../../distro/js/virtualDungeon-min.js --debug
echo Done