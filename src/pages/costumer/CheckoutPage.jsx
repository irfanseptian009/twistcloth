import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";
import { fetchCart, clearCart } from "../../store/features/cart/CartSlice";
import { useTheme } from "../../contexts/ThemeContext";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router";
import { storeConfig } from "../../config/store";

const CheckoutPage = () => {
  const { colors, glass, button } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid;

  const { carts, status } = useSelector((state) => state.cart);
    const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [productChoices, setProductChoices] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  // Initialize product choices for each cart item
  useEffect(() => {
    if (carts.length > 0) {
      const choices = {};
      carts.forEach(item => {
        choices[item.id] = {
          size: '',
          color: '',
          notes: ''
        };
      });
      setProductChoices(choices);
    }
  }, [carts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductChoiceChange = (cartId, field, value) => {
    setProductChoices(prev => ({
      ...prev,
      [cartId]: {
        ...prev[cartId],
        [field]: value
      }
    }));
  };

  const totalPrice = carts.reduce((sum, cart) => sum + cart.quantity * cart.price, 0);

  const generateWhatsAppMessage = () => {
    let message = `*PESANAN BARU*\n\n`;
    message += `*Informasi Pelanggan:*\n`;
    message += `Nama: ${customerInfo.name}\n`;
    message += `No. HP: ${customerInfo.phone}\n`;
    message += `Email: ${customerInfo.email}\n`;
    message += `Alamat: ${customerInfo.address}\n\n`;
    
    message += `*Detail Pesanan:*\n`;
    carts.forEach((item, index) => {
      const choices = productChoices[item.id] || {};
      message += `${index + 1}. ${item.name}\n`;
      message += `   - Jumlah: ${item.quantity}\n`;
      message += `   - Harga: Rp${item.price.toLocaleString()}\n`;
      if (choices.size) message += `   - Ukuran: ${choices.size}\n`;
      if (choices.color) message += `   - Warna: ${choices.color}\n`;
      if (choices.notes) message += `   - Catatan: ${choices.notes}\n`;
      message += `   - Subtotal: Rp${(item.quantity * item.price).toLocaleString()}\n\n`;
    });
    
    message += `*Total Pembayaran: Rp${totalPrice.toLocaleString()}*\n\n`;
    message += `Mohon konfirmasi pesanan ini. Terima kasih! 🙏`;
    
    return message;
  };
  const handleCheckout = async () => {
    // Validation
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      toast.error("Mohon lengkapi informasi pelanggan!");
      return;
    }

    if (carts.length === 0) {
      toast.error("Keranjang kosong!");
      return;
    }

    // Validate phone number format
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    if (!phoneRegex.test(customerInfo.phone)) {
      toast.error("Format nomor WhatsApp tidak valid! Contoh: 081234567890");
      return;
    }

    setIsProcessing(true);

    try {
      // Generate WhatsApp URL
      const waMessage = generateWhatsAppMessage();
      const encodedMessage = encodeURIComponent(waMessage);
      const whatsappNumber = storeConfig.whatsapp.number;
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

      // Open WhatsApp
      window.open(whatsappUrl, '_blank');

      // Clear cart and show success message
      await dispatch(clearCart(userId));
      toast.success("Pesanan dikirim ke WhatsApp! Keranjang telah dikosongkan.");
      
      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      toast.error("Terjadi kesalahan saat memproses pesanan.");
      console.error("Checkout error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (carts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className={`text-center ${colors.text}`}>
          <h2 className="text-2xl font-bold mb-4">Keranjang Kosong</h2>
          <p className="mb-4">Tidak ada produk dalam keranjang belanja Anda.</p>
          <button
            onClick={() => navigate('/')}
            className={`${button.primary} px-6 py-2 rounded-lg`}
          >
            Kembali Berbelanja
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className={`${colors.text} mb-8`}>
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className={`${colors.textMuted}`}>Lengkapi informasi pesanan Anda</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customer Information Form */}
        <div className={`${glass.background} ${glass.border} p-6 rounded-xl backdrop-blur-lg`}>
          <h2 className={`text-xl font-bold ${colors.text} mb-6`}>Informasi Pelanggan</h2>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Nama Lengkap *
              </label>              <input
                type="text"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap Anda"
                className={`w-full px-4 py-2 border rounded-lg ${colors.surface} ${colors.border} ${colors.text} focus:ring-2 focus:ring-purple-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Nomor WhatsApp *
              </label>
              <input
                type="tel"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                placeholder="08xxxxxxxxxx"
                className={`w-full px-4 py-2 border rounded-lg ${colors.surface} ${colors.border} ${colors.text} focus:ring-2 focus:ring-purple-500`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Email
              </label>              <input
                type="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                placeholder="nama@email.com (opsional)"
                className={`w-full px-4 py-2 border rounded-lg ${colors.surface} ${colors.border} ${colors.text} focus:ring-2 focus:ring-purple-500`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${colors.text} mb-2`}>
                Alamat Lengkap *
              </label>              <textarea
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                rows="3"
                placeholder="Masukkan alamat lengkap untuk pengiriman"
                className={`w-full px-4 py-2 border rounded-lg ${colors.surface} ${colors.border} ${colors.text} focus:ring-2 focus:ring-purple-500`}
                required
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className={`${glass.background} ${glass.border} p-6 rounded-xl backdrop-blur-lg`}>
          <h2 className={`text-xl font-bold ${colors.text} mb-6`}>Ringkasan Pesanan</h2>
          
          <div className="space-y-6">
            {carts.map((item) => (
              <div key={item.id} className={`border-b ${colors.borderLight} pb-4`}>
                <div className="flex items-start space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className={`font-medium ${colors.text}`}>{item.name}</h3>
                    <p className={`text-sm ${colors.textMuted}`}>
                      Qty: {item.quantity} × Rp{item.price.toLocaleString()}
                    </p>
                    <p className={`font-bold ${colors.primary}`}>
                      Rp{(item.quantity * item.price).toLocaleString()}
                    </p>

                    {/* Product Choices */}
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Ukuran (S/M/L/XL)"
                          value={productChoices[item.id]?.size || ''}
                          onChange={(e) => handleProductChoiceChange(item.id, 'size', e.target.value)}
                          className={`px-2 py-1 text-sm border rounded ${colors.surface} ${colors.border} ${colors.text}`}
                        />
                        <input
                          type="text"
                          placeholder="Warna"
                          value={productChoices[item.id]?.color || ''}
                          onChange={(e) => handleProductChoiceChange(item.id, 'color', e.target.value)}
                          className={`px-2 py-1 text-sm border rounded ${colors.surface} ${colors.border} ${colors.text}`}
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Catatan khusus"
                        value={productChoices[item.id]?.notes || ''}
                        onChange={(e) => handleProductChoiceChange(item.id, 'notes', e.target.value)}
                        className={`w-full px-2 py-1 text-sm border rounded ${colors.surface} ${colors.border} ${colors.text}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <div className={`flex justify-between text-xl font-bold ${colors.text}`}>
              <span>Total</span>
              <span className={`${colors.primary}`}>Rp{totalPrice.toLocaleString()}</span>
            </div>
          </div>          <div className="mt-6 space-y-3">
            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className={`w-full ${button.primary} py-3 rounded-lg font-bold transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </span>
              ) : (
                "💬 Pesan via WhatsApp"
              )}
            </button>
            <button
              onClick={() => navigate('/')}
              disabled={isProcessing}
              className={`w-full ${button.secondary} py-2 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Kembali Berbelanja
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
