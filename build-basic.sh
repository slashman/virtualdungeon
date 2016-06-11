echo Packaging with Matthew Pablo music and basic dungeons
set -v
rm -rf distro/*
mkdir distro/js
mkdir distro/mp3
cp resources/js/adapter.js distro/js
cp resources/js/matthew-pablo.js distro/js/exodus-cfg.js
mkdir src/js/scenarios
mkdir src/js/dungeons
cp resources/js/scenarios/RequireBasicScenario.js src/js/LoadScenario.js
cp resources/js/scenarios/Basic.js src/js/scenarios
cp resources/js/dungeons/Basic.js src/js/dungeons
cp resources/js/matthew-pablo.js distro/js/exodus-cfg.js
cp resources/html/index.html distro
cp resources/css/virtualDungeon.css distro
cp resources/mp3/matthew-pablo/* distro/mp3
cd src/js
browserify VirtualDungeon.js -o ../../distro/js/virtualDungeon-min.js
# watchify VirtualDungeon.js -o ../../distro/js/virtualDungeon-min.js --debug
cd ../..
rm -rf src/js/scenarios
rm -rf src/js/dungeons
rm src/js/LoadScenario.js
echo Done