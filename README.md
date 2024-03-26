# go_srhl7

Send and Receive HL7 messages.

To build in the ClientApp folder run
ng build --base-href /ui/

Then in the root folder run
go build .

Then run go-srhl7.exe

In a browser open http://localhost:8080/ui

To install windows service
sc create go-srhl7 binpath= "%CD%\go-srhl7.exe" start= auto DisplayName= "go-srhl7"

To start service
net start go-srhl7

To stop service
net stop go-srhl7

To uninstall windows service
sc delete go-srhl7
