import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Konfigurasi dasar untuk menyesuaikan dengan tema glassmorphism
const baseConfig = {
    background: '#0f1423',
    color: '#ffffff',
    backdrop: `
        rgba(0,0,0,0.6)
        backdrop-filter: blur(4px)
    `,
    customClass: {
        popup: 'border border-white/10 rounded-3xl shadow-2xl',
        title: 'text-2xl font-black italic tracking-tight',
        htmlContainer: 'text-gray-400 text-sm',
        confirmButton: 'bg-[#8B5CF6] hover:bg-[#7c4dff] text-white px-6 py-2 rounded-xl font-bold transition-colors outline-none mx-2',
        cancelButton: 'bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-xl font-bold transition-colors border border-white/10 outline-none mx-2',
    },
    buttonsStyling: false,
};

export const CustomAlert = {
    /**
     * Menampilkan notifikasi sukses
     */
    success: (title, text) => {
        return MySwal.fire({
            ...baseConfig,
            icon: 'success',
            title: title,
            text: text,
            iconColor: '#00F5FF',
            confirmButtonText: 'Oke',
        });
    },

    /**
     * Menampilkan notifikasi error
     */
    error: (title, text) => {
        return MySwal.fire({
            ...baseConfig,
            icon: 'error',
            title: title,
            text: text,
            iconColor: '#ef4444', // Red 500
            confirmButtonText: 'Tutup',
        });
    },

    /**
     * Menampilkan dialog konfirmasi penghapusan
     */
    confirmDelete: (itemName = 'data ini') => {
        return MySwal.fire({
            ...baseConfig,
            icon: 'warning',
            title: 'Hapus Data?',
            text: `Apakah Anda yakin ingin menghapus ${itemName}? Tindakan ini tidak dapat dibatalkan.`,
            iconColor: '#f59e0b', // Amber 500
            showCancelButton: true,
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            customClass: {
                ...baseConfig.customClass,
                confirmButton: 'bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-bold transition-colors outline-none mx-2',
            }
        });
    }
};
