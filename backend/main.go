package main

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"os/signal"
	"syscall"

	"gamer-hub-api/database"
	"gamer-hub-api/routes"

	"github.com/gofiber/fiber/v2"
)

// startPythonMicroservice menjalankan uvicorn dari virtual environment di latar belakang
func startPythonMicroservice() *exec.Cmd {
	// Menunjuk langsung ke executable uvicorn di dalam .venv dari folder python_microservice
	// Jalur eksekusi dihitung dari lokasi Golang (backend/), jadi kita butuh "../" di depan
	cmd := exec.Command("../python_microservice/.venv/Scripts/uvicorn.exe", "app:app", "--port", "8000")
	cmd.Dir = "../python_microservice" // Berpindah ke folder python sebelum mengeksekusi

	// Menyambungkan output Python ke terminal Golang agar lognya menyatu
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	fmt.Println("[Golang] Memulai Python Microservice (Genshin Dashboard)...")
	if err := cmd.Start(); err != nil {
		log.Printf("[Golang] Gagal menyalakan Python Microservice: %v\n", err)
		return nil
	}
	return cmd
}

func main() {
	// 1. Inisialisasi Database
	database.ConnectDatabase()

	// 2. Jalankan Seeder (opsional)
	// database.SeedAll()

	// 3. Menyalakan Python Microservice (Sidecar)
	pythonProcess := startPythonMicroservice()

	// 4. Setup Fiber App
	app := fiber.New()
	routes.SetupRoutes(app)

	// 5. Jalankan Server Fiber di Goroutine (Agar tidak memblokir kode di bawahnya)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	go func() {
		if err := app.Listen(":" + port); err != nil {
			log.Panic(err)
		}
	}()

	// 6. Graceful Shutdown (Mencegat Ctrl+C)
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)

	<-c // Kode akan berhenti di sini dan menunggu Anda menekan Ctrl+C

	fmt.Println("\n[Golang] Mematikan server secara perlahan...")

	// Matikan Python Microservice terlebih dahulu agar tidak menjadi zombie
	if pythonProcess != nil && pythonProcess.Process != nil {
		fmt.Println("[Golang] Membunuh proses Python Microservice...")
		pythonProcess.Process.Kill()
	}

	// Matikan Fiber
	fmt.Println("[Golang] Mematikan Fiber...")
	app.Shutdown()

	fmt.Println("[Golang] Selamat tinggal!")
}
