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
	Category  string         `gorm:"type:varchar(100)" json:"category"`
	Tags      string         `gorm:"type:varchar(255)" json:"tags"` // Disimpan sebagai string CSV
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

// Game mewakili koleksi gaming dan progres
type Game struct {
	ID                uint   `gorm:"primaryKey" json:"id"`
	GameName          string `gorm:"type:varchar(255);not null" json:"game_name"`
	UID               string `gorm:"type:varchar(100)" json:"uid"` // In-game UID
	Description       string `gorm:"type:text" json:"description"`
	FavoriteCharacter string `gorm:"type:varchar(255)" json:"favorite_character"`
	Progress          int    `json:"progress"` // Persentase progres
}

// Profile mewakili data pribadi user
type Profile struct {
	ID            uint   `gorm:"primaryKey" json:"id"`
	Nickname      string `gorm:"type:varchar(100)" json:"nickname"`
	Bio           string `gorm:"type:text" json:"bio"`
	CurrentStatus string `gorm:"type:varchar(255)" json:"current_status"`
	SocialLinks   string `gorm:"type:text" json:"social_links"` // JSON string
}
