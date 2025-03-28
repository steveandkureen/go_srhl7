package worker

import (
	"testing"
)

func TestCreateConnection(t *testing.T) {
	connection, err := CreateSendConnection("connectionId", "127.0.0.1", "5000")
	if err != nil {
		t.Fatalf(err.Error())
	}

	if connection == nil {
		t.Fatalf("Connection is nil")
	}
}

func TestCreateConnectionIdBlank(t *testing.T) {
	connection, err := CreateSendConnection("", "127.0.0.1", "5000")
	if err == nil {
		t.Fatalf("Error was not thrown for empty connection id")
	}

	if connection != nil {
		t.Fatalf("Connection should be nil")
	}
}

func TestCreateIpAddressBlank(t *testing.T) {
	connection, err := CreateSendConnection("connection id", "", "5000")
	if err == nil {
		t.Fatalf("Error was not thrown for empty ipaddress")
	}

	if connection != nil {
		t.Fatalf("Connection should be nil")
	}
}

func TestCreatePortBlank(t *testing.T) {
	connection, err := CreateSendConnection("connection id", "127.0.0.1", "")
	if err == nil {
		t.Fatalf("Error was not thrown for empty port")
	}

	if connection != nil {
		t.Fatalf("Connection should be nil")
	}
}

// func TestConnectionStartStop(t *testing.T) {
// 	listen, err := SetupListenConnection("listen id", "127.0.0.1", "5986")
// 	if err != nil {
// 		t.Fatalf("Error creating listen connection: " + err.Error())
// 	}
// 	listen.Connect()
// 	connection, err := CreateSendConnection("connection id", "127.0.0.1", "5986")
// 	if err != nil {
// 		t.Fatalf("Error creating connection: " + err.Error())
// 	}
//
// 	connection.Connect()
//
// 	if listen.connected == false {
// 		t.Fatalf("Listen connection is not connected")
// 	}
// 	if connection.connected == false {
// 		t.Fatalf("Send connection is not connected")
// 	}
//
// 	time.Sleep(1 * time.Second)
// 	connection.Disconnect()
//
// }

//	func TestConnect(t *testing.T) {
//		setupMockDialTimeout()
//
//		connection, err := CreateSendConnection("connection id", "127.0.0.1", "59868")
//		if err != nil {
//			t.Fatalf(err.Error())
//		}
//
//		if connection != nil {
//			t.Fatalf("Connection should be nil")
//		}
//
//		connection.Connect()
//
//		if !connection.connected {
//			t.Fatalf("Connection is not connected")
//		}
//
// }
func SetupListenConnection(id string, ip string, port string) (*ListenConnection, error) {
	connection, err := CreateListenConnection(id, ip, port)
	if err != nil {
		return nil, err
	}
	connection.Connect()
	return connection, nil
}
