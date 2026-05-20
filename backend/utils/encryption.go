package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"errors"
	"io"
	"os"
)

// getEncryptionKey mengambil key dari environment variable
func getEncryptionKey() ([]byte, error) {
	key := os.Getenv("VAULT_ENCRYPTION_KEY")
	if len(key) != 32 {
		return nil, errors.New("VAULT_ENCRYPTION_KEY harus tepat 32 karakter")
	}
	return []byte(key), nil
}

// EncryptAES mengenkripsi teks biasa (plaintext) menjadi ciphertext berformat hex
func EncryptAES(plaintext string) (string, error) {
	key, err := getEncryptionKey()
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	// Create a nonce. Nonce should be unique for every encryption
	nonce := make([]byte, aesGCM.NonceSize())
	if _, err = io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}

	// Encrypt the data
	ciphertext := aesGCM.Seal(nonce, nonce, []byte(plaintext), nil)
	
	// Return as hex string so it can be stored easily in varchar/text
	return hex.EncodeToString(ciphertext), nil
}

// DecryptAES mendekripsi ciphertext berformat hex menjadi teks asli (plaintext)
func DecryptAES(cryptoText string) (string, error) {
	key, err := getEncryptionKey()
	if err != nil {
		return "", err
	}

	enc, err := hex.DecodeString(cryptoText)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	aesGCM, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}

	nonceSize := aesGCM.NonceSize()
	if len(enc) < nonceSize {
		return "", errors.New("ciphertext terlalu pendek")
	}

	// Extract the nonce and the actual ciphertext
	nonce, ciphertext := enc[:nonceSize], enc[nonceSize:]

	// Decrypt the data
	plaintext, err := aesGCM.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}

	return string(plaintext), nil
}
