package factories

import (
	"errors"
	model "go-srhl7/internal/models"
	worker "go-srhl7/internal/workers"
)

type ConnectionFactory struct {
	Connections map[string]*worker.Connection
}

func (f *ConnectionFactory) Init() {
	f.Connections = make(map[string]*worker.Connection)
}

func (f *ConnectionFactory) GetConnection(conModel model.ConnectionModel) (worker.Connection, error) {
	var connection worker.Connection
	var err error

	existingConnection := f.GetExistingConnection(conModel)
	if existingConnection != nil {
		return *existingConnection, nil
	}

	if conModel.Type == model.SendType {
		connection, err = worker.CreateSendConnection(conModel.ClientId, conModel.IpAddress, conModel.Port)
	} else {
		connection, err = worker.CreateListenConnection(conModel.ClientId, conModel.IpAddress, conModel.Port)
	}
	if err != nil {
		return nil, errors.New("connection failed")
	}

	f.Connections[connection.GetConnectionId()] = &connection
	return connection, nil
}

func (f *ConnectionFactory) GetExistingConnection(conModel model.ConnectionModel) *worker.Connection {
	var connectionId string
	if conModel.Type == model.SendType {
		connectionId = worker.GetSendConnectionId(conModel.ClientId)
	} else {
		connectionId = worker.GetListenConnectionId(conModel.ClientId)
	}
	value, exists := f.Connections[connectionId]
	if exists {
		(*value).AddConnection()
		return value
	}
	return nil
}

func (f *ConnectionFactory) RemoveConnection(connectionId string) {
	conn := *f.Connections[connectionId]
	conn.Disconnect()
	delete(f.Connections, connectionId)
}
