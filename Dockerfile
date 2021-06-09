FROM golang:1.14.7

COPY . .

CMD ["go", "run", "main.go"]