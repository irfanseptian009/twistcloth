// Configuration file for store settings
export const storeConfig = {
  // WhatsApp configuration
  whatsapp: {
    number: "6281234567890", 
    message: {
      greeting: "Halo, saya ingin memesan produk berikut:",
      footer: "Mohon konfirmasi pesanan ini. Terima kasih! 🙏"
    }
  },
  
  // Store information
  store: {
    name: "Darknessmerch",
    address: "Alamat Toko",
    email: "admin@darknessmerch.com"
  },
  
  // Payment methods
  payment: {
    methods: ["WhatsApp", "Transfer Bank", "COD"],
    bankAccounts: [
      {
        bank: "BCA",
        accountNumber: "1234567890",
        accountHolder: "Darknessmerch"
      }
    ]
  }
};
