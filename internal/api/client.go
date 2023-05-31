package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/fs"
	"io/ioutil"
	"net/http"
	"os"
	"sync"

	//"net/http"
	model "go-srhl7/internal/models"

	"github.com/gin-gonic/gin"
)

var rwMutex = &sync.RWMutex{}

func getClients(c *gin.Context) {
	clientData, err := readClientData()
	if err != nil {
		return
	}
	c.IndentedJSON(http.StatusOK, clientData)
}

func getClient(c *gin.Context) {
	id := c.Param("id")
	client, err := getClientById(id)
	if err != nil {
		c.AbortWithError(http.StatusNotFound, err)
	}

	c.IndentedJSON(http.StatusOK, client)
}

func getClientById(id string) (*model.Client, error) {
	clientData, err := readClientData()
	if err != nil {
		return nil, errors.New("Client data could not be read")
	}

	for _, c := range clientData {
		if c.ClientId == id {
			return &c, nil
		}
	}
	return nil, errors.New("client not found")
}

func addClient(c *gin.Context) {
	var newClient model.Client

	if err := c.BindJSON(&newClient); err != nil {
		return
	}

	clientData, err := readClientData()
	if err != nil {
		return
	}

	clientData = append(clientData, newClient)
	saveClientData(clientData)
}

func updateClient(c *gin.Context) {
	var newClient model.Client

	if err := c.BindJSON(&newClient); err != nil {
		return
	}

	clientData, err := readClientData()
	if err != nil {
		return
	}

	for i, c := range clientData {
		if c.ClientId == newClient.ClientId {
			clientData = append(clientData[:i], clientData[i+1:]...)
			break
		}
	}

	clientData = append(clientData, newClient)
	saveClientData(clientData)
}

func deleteClient(c *gin.Context) {
	clientData, err := readClientData()
	if err != nil {
		return
	}

	id := c.Param("id")
	for i, c := range clientData {
		if c.ClientId == id {
			clientData = append(clientData[:i], clientData[i+1:]...)
			break
		}
	}

	saveClientData(clientData)
}

func readClientData() ([]model.Client, error) {
	rwMutex.RLock()
	defer rwMutex.RUnlock()

	_, err := os.Stat("./ClientData/clientData.json")
	if os.IsNotExist(err) {
		fmt.Println("unable to read file: ", err)
		return []model.Client{}, err
	}
	data, err := ioutil.ReadFile("./ClientData/clientData.json")
	if err != nil {

	}
	var clientData []model.Client
	json.Unmarshal(data, &clientData)

	return clientData, nil
}

func saveClientData(cliendData []model.Client) error {
	rwMutex.Lock()
	defer rwMutex.Unlock()

	_, err := os.Stat("./ClientData/clientData.json")
	if os.IsNotExist(err) {
		fmt.Println("unable to read file: ", err)
		return err
	}
	data, err := json.Marshal(cliendData)
	if err != nil {
		fmt.Println("unable to convert to json: ", err)
		return err
	}

	err2 := ioutil.WriteFile("./ClientData/clientData.json", data, fs.ModeExclusive)
	if err2 != nil {
		fmt.Println("unable to write file: ", err)
		return err2
	}
	return nil
}

func RegisterClientRoutes(router *gin.RouterGroup) {
	router.GET("/client", getClients)
	router.GET("/client/:id", getClient)
	router.POST("/client", addClient)
	router.PUT("/client", updateClient)
	router.DELETE("/client/:id", deleteClient)
}
