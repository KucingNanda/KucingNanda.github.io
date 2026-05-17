package models

type User struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Username string `gorm:"type:varchar(100);unique" json:"username"`
	Password string `gorm:"type:varchar(255)" json:"-"`
}
