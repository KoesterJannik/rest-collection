FROM golang:1.20-alpine

WORKDIR /app

# Copy go.mod and go.sum files to the working directory
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the rest of the application code to the working directory
COPY . .

# Build the application
RUN go build -o app .

# Expose port 8080
EXPOSE 8080

# Start the application
CMD ["./app"]
