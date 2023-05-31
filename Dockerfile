FROM golang:latest

WORKDIR /go-srhl7


COPY ./dist ./dist/
COPY ./ClientData ./ClientData/
COPY ./internal ./internal/


COPY go.mod go.sum ./
RUN go mod download

COPY ./main.go .
RUN ls -l .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o .

EXPOSE 8000-9999
EXPOSE 8080
CMD /go-srhl7/go-srhl7
