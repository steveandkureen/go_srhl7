package api

import (
	"fmt"
	"io/ioutil"
	"os"

	"github.com/gin-gonic/gin"
)

func LoadSegmentDetail(c *gin.Context) {
	segmentId := c.Param("id")
	json, err := readSegmentData(segmentId)
	if err != nil {
		return
	}

	c.Writer.Header().Set("Content-Type", "application/json")
	c.Writer.Write([]byte(json))
	c.Writer.Flush()
}

func readSegmentData(id string) (string, error) {
	_, err := os.Stat("./ClientData/SegmentDetails/" + id + ".json")
	if os.IsNotExist(err) {
		fmt.Println("unable to read file: ", err)
		return "", err
	}
	data, err := ioutil.ReadFile("./ClientData/SegmentDetails/" + id + ".json")
	if err != nil {

	}

	return string(data), nil
}

func RegisterSegmentRoutes(router *gin.RouterGroup) {
	router.GET("/segmentdetials/:id", LoadSegmentDetail)
}
