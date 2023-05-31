package api

import (
	"encoding/json"
	"go-srhl7/internal/factories"
	model "go-srhl7/internal/models"
	"io"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Connect(c *gin.Context) {
	var connectModel model.ConnectionModel

	if err := c.BindJSON(&connectModel); err != nil {
		return
	}

	cf := c.MustGet("cf").(*factories.ConnectionFactory)

	connection, err := cf.GetConnection(connectModel)
	if err != nil {
		return
	}

	if connection.IsConnected() == false {
		connection.Connect()
	}
	connectModel.ConnectionId = connection.GetConnectionId()
	c.IndentedJSON(http.StatusOK, connectModel)
}

func Disconnect(c *gin.Context) {
	connectionId := c.Param("id")
	cf := c.MustGet("cf").(*factories.ConnectionFactory)
	cf.RemoveConnection(connectionId)
}

func SeverSideEvent(c *gin.Context) {
	connectionId := c.Param("connectionId")
	cf := c.MustGet("cf").(*factories.ConnectionFactory)
	conn := *cf.Connections[connectionId]

	c.Writer.Header().Set("Content-Type", "text/event-stream")
	c.Writer.Header().Set("Cache-Control", "no-cache")
	c.Writer.Header().Set("X-Accel-Buffering", "no")

	ch := *conn.GetResponseChannel()
	gone := c.Stream(func(w io.Writer) bool {
		for {
			response := <-ch
			out, _ := json.Marshal(response)
			c.Writer.Write([]byte("data: "))
			c.Writer.Write(out)
			c.Writer.Write([]byte("\n\n"))
			c.Writer.Flush()

			if !conn.IsConnected() {
				return false
			}
		}
	})
	if gone {
		// do something after client is gone
		log.Println("client is gone")
	}
}

func SendMessage(c *gin.Context) {
	var messageModels []model.MessageModel

	if err := c.BindJSON(&messageModels); err != nil {
		return
	}
	cf := c.MustGet("cf").(*factories.ConnectionFactory)

	for _, m := range messageModels {
		conn := *cf.Connections[m.ConnectionId]

		ch := *conn.GetSubmitChannel()
		ch <- m

		m.MessageStatus = model.Sending
	}

	c.IndentedJSON(http.StatusOK, messageModels)
}

func RegisterConnectionRoutes(router *gin.RouterGroup) {
	router.POST("/connection", Connect)
	router.DELETE("/connection/:id", Disconnect)
	router.PUT("/message", SendMessage)
	router.GET("/message/sse/:connectionId/:clientid", SeverSideEvent)
}
