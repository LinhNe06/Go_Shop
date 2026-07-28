package main

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

var db *sql.DB

func connectDB() error {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		return fmt.Errorf("DATABASE_URL is required")
	}

	var err error
	db, err = sql.Open("pgx", dsn)
	if err != nil {
		return err
	}
	return db.Ping()
}
