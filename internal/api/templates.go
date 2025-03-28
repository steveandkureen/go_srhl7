package api

import (
	"encoding/json"
	"fmt"
	model "go-srhl7/internal/models"
	"io/fs"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func getTemplates(c *gin.Context) {
	clientId := c.Param("clientid")
	templdateData, err := readTemplateData()
	if err != nil {
		return
	}
	clientTemplates := []model.Template{}
	for _, v := range templdateData {
		if v.ClientId == clientId {
			clientTemplates = append(clientTemplates, v)
		}
	}
	c.IndentedJSON(http.StatusOK, clientTemplates)
}

func addTemplate(c *gin.Context) {
	var newTemplate model.Template

	if err := c.BindJSON(&newTemplate); err != nil {
		return
	}

	templdateData, err := readTemplateData()
	if err != nil {
		return
	}

	templdateData = append(templdateData, newTemplate)
	saveTemplateData(templdateData)
}

func getTemplate(c *gin.Context) {

}

func readTemplateData(filePaths ...string) ([]model.Template, error) {
	filePath := "./ClientData/templateData.json"
	if len(filePaths) > 0 {
		filePath = filePaths[0]
	}

	rwMutex.RLock()
	defer rwMutex.RUnlock()

	_, err := os.Stat(filePath)
	if os.IsNotExist(err) {
		fmt.Println("unable to read file: ", err)
		return []model.Template{}, err
	}
	data, err := os.ReadFile(filePath)
	if err != nil {

	}
	var templateData []model.Template
	json.Unmarshal(data, &templateData)

	return templateData, nil
}

func saveTemplateData(templdateData []model.Template) error {
	rwMutex.Lock()
	defer rwMutex.Unlock()

	_, err := os.Stat("./ClientData/templateData.json")
	if os.IsNotExist(err) {
		fmt.Println("unable to read file: ", err)
		return err
	}
	data, err := json.Marshal(templdateData)
	if err != nil {
		fmt.Println("unable to convert to json: ", err)
		return err
	}

	err2 := ioutil.WriteFile("./ClientData/templateData.json", data, fs.ModeExclusive)
	if err2 != nil {
		fmt.Println("unable to write file: ", err)
		return err2
	}
	return nil
}

func RegisterTempalteRoutes(router *gin.RouterGroup) {
	router.GET("/templates/:clientid", getTemplates)
	router.GET("/templates/:clientid/:id", getTemplate)
	router.POST("/templates", addTemplate)
}
