package models

import (
	"time"

	"gorm.io/gorm"
)

// Gallery mewakili tabel hasil PixAI / Art Showcase
type Gallery struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Title     string         `gorm:"type:varchar(255);not null" json:"title"`
	ImageURL  string         `gorm:"type:text;not null" json:"image_url"`
	Info      string         `gorm:"type:varchar(100)" json:"info"` // Menyimpan AI Art, Art, Cosplay
	Category  string         `gorm:"type:varchar(100)" json:"category"` // Menyimpan Character, Skenario, dll
	Tags      string         `gorm:"type:varchar(255)" json:"tags"` // Disimpan sebagai string CSV
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// Game mewakili koleksi gaming
type Game struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	GameName string `gorm:"type:varchar(255);not null" json:"game_name"`
	Nickname string `gorm:"type:varchar(100)" json:"nickname"`
	UID      string `gorm:"type:varchar(100)" json:"uid"` // In-game UID
	Bio      string `gorm:"type:text" json:"bio"`
}

// Profile mewakili data pribadi user
type Profile struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	Nickname      string `gorm:"type:varchar(100)" json:"nickname"`
	Bio           string `gorm:"type:text" json:"bio"`
	CurrentStatus string `gorm:"type:varchar(255)" json:"current_status"`
	SocialLinks   string `gorm:"type:text" json:"social_links"` // JSON string
	TechStack     string `gorm:"type:text" json:"tech_stack"`   // JSON string
}

// Vault mewakili catatan kredensial penting (Notepad admin)
type Vault struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Platform  string         `gorm:"type:varchar(255);not null" json:"platform"`
	Username  string         `gorm:"type:varchar(255)" json:"username"`
	Password  string         `gorm:"type:varchar(255)" json:"password"`
	Notes     string         `gorm:"type:text" json:"notes"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
}
