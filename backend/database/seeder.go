package database

import (
	"fmt"
	"gamer-hub-api/models"
	"log"

	"golang.org/x/crypto/bcrypt"
)

// SeedAll menjalankan semua fungsi seeder
func SeedAll() {
	SeedUser()
	SeedProfile()
	SeedGames()
	SeedGalleries()
	fmt.Println("✅ Proses Seeding Selesai")
}

// SeedUser membuat akun admin default jika belum ada
func SeedUser() {
	var count int64
	DB.Model(&models.User{}).Count(&count)
	if count == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		user := models.User{
			Username: "admin",
			Password: string(hashedPassword),
		}
		if err := DB.Create(&user).Error; err != nil {
			log.Println("Gagal seed user:", err)
		} else {
			log.Println("🌱 Seeded Admin User")
		}
	}
}

// SeedProfile memasukkan dummy data untuk Profile
func SeedProfile() {
	var count int64
	DB.Model(&models.Profile{}).Count(&count)
	if count == 0 {
		profile := models.Profile{
			Nickname:      "NandaSR",
			Bio:           "Seorang pengembang web yang tertarik dengan teknologi modern.",
			CurrentStatus: "Sedang eksplorasi sistem AI",
			SocialLinks:   `{"github":"https://github.com/KucingNanda"}`,
		}
		if err := DB.Create(&profile).Error; err != nil {
			log.Println("Gagal seed profile:", err)
		} else {
			log.Println("🌱 Seeded Profile data")
		}
	}
}

// SeedGames memasukkan dummy data untuk Game
func SeedGames() {
	var count int64
	DB.Model(&models.Game{}).Count(&count)
	if count == 0 {
		games := []models.Game{
			{GameName: "Genshin Impact", Nickname: "NandaSR", UID: "800000000", Bio: "Eksplorasi Teyvat"},
			{GameName: "Honkai: Star Rail", Nickname: "NandaSR", UID: "800000001", Bio: "Perjalanan Astral Express"},
			{GameName: "Mobile Legends: Bang Bang", Nickname: "NandaSR", UID: "800000002", Bio: "Push Rank Mythic"},
		}
		if err := DB.Create(&games).Error; err != nil {
			log.Println("Gagal seed games:", err)
		} else {
			log.Println("🌱 Seeded Games data")
		}
	}
}

// SeedGalleries memasukkan dummy data untuk Gallery
func SeedGalleries() {
	var count int64
	DB.Model(&models.Gallery{}).Count(&count)
	if count == 0 {
		galleries := []models.Gallery{
			{Title: "Project Neo Art #1", ImageURL: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=500&q=60", Category: "CHARACTER", Tags: "AI, PixAI, Anime"},
			{Title: "Cyberpunk Cityscape", ImageURL: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?auto=format&fit=crop&w=500&q=60", Category: "LANDSCAPE", Tags: "Cyberpunk, City, Night"},
			{Title: "Mystic Forest", ImageURL: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=500&q=60", Category: "BACKGROUND", Tags: "Nature, Fantasy"},
			{Title: "Mecha Concept", ImageURL: "https://images.unsplash.com/photo-1620052726372-e1aee6b3341b?auto=format&fit=crop&w=500&q=60", Category: "MECHA", Tags: "Robot, Concept, Sci-Fi"},
			{Title: "Digital Portrait", ImageURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=60", Category: "PORTRAIT", Tags: "Digital Art, Female"},
			{Title: "Abstract Neon", ImageURL: "https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=500&q=60", Category: "ABSTRACT", Tags: "Colors, Digital"},
		}
		if err := DB.Create(&galleries).Error; err != nil {
			log.Println("Gagal seed galleries:", err)
		} else {
			log.Println("🌱 Seeded Galleries data")
		}
	}
}
