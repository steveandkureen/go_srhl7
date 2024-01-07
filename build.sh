echo "Build Angular App"
cd ClientApp
ng build --base-href="/ui/"
echo "Build golang"
cd ..
go build .