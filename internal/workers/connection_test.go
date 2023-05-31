package worker

import (
	"net"
	"time"

	"github.com/stretchr/testify/mock"
)

var dialTimeoutFunc = net.DialTimeout

func mockDialTimeout(network, address string, timeout time.Duration) (net.Conn, error) {
	mock := new(MockConn)
	return mock, nil
}

func setupMockDialTimeout() {
	net.DialTimeout = mockDialTimeout
}

func teardownMockDialTimeout() {
	net.DialTimeout = dialTimeoutFunc
}

type Conn interface {
	Write([]byte) (int, error)
	Read([]byte) (int, error)
	Close() error
	// Add any other methods you use
}

// Create a mock implementation of the net.Conn interface
type MockConn struct {
	mock.Mock
}

func (m *MockConn) Read(b []byte) (n int, err error) {
	args := m.Called(b)
	return args.Int(0), args.Error(1)
}

func (m *MockConn) Write(b []byte) (n int, err error) {
	args := m.Called(b)
	return args.Int(0), args.Error(1)
}

func (m *MockConn) Close() error {
	args := m.Called()
	return args.Error(0)
}

func (m *MockConn) LocalAddr() net.Addr {
	args := m.Called()
	return args.Get(0).(net.Addr)
}

func (m *MockConn) RemoteAddr() net.Addr {
	args := m.Called()
	return args.Get(0).(net.Addr)
}

func (m *MockConn) SetDeadline(t time.Time) error {
	args := m.Called(t)
	return args.Error(0)
}

func (m *MockConn) SetReadDeadline(t time.Time) error {
	args := m.Called(t)
	return args.Error(0)
}

func (m *MockConn) SetWriteDeadline(t time.Time) error {
	args := m.Called(t)
	return args.Error(0)
}
