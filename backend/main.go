package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()
	if err := connectDB(); err != nil {
		log.Fatal("Không kết nối được PostgreSQL: ", err)
	}
	defer db.Close()

	if err := os.MkdirAll("uploads", 0o755); err != nil {
		log.Fatal("Không tạo được thư mục uploads: ", err)
	}

	r := gin.Default()
	r.MaxMultipartMemory = 8 << 20
	r.Static("/uploads", "./uploads")

	api := r.Group("/api")
	api.GET("/health", healthCheck)
	api.GET("/products", listProducts)
	api.GET("/products/:id", getProduct)
	api.POST("/products", createProduct)
	api.PUT("/products/:id", updateProduct)
	api.DELETE("/products/:id", deleteProduct)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("API chạy tại http://localhost:" + port)
	log.Fatal(r.Run(":" + port))
}
