FROM golang:1.14.7

COPY main.go /app/main.go

CMD ["go", "run", "/app/main.go"]

