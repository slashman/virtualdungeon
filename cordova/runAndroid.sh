echo Building Android Package
rm -rf www/*
cp -r ../distro/* www
rm www/AUTOGENERATED
cordova run android