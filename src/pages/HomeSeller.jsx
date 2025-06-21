
import { useTheme } from "../contexts/ThemeContext";

export default function HomeSeller() {
  const { colors, glass } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${colors.background}`}>
      <div className={`${glass.background} ${glass.border} p-8 rounded-2xl shadow-2xl backdrop-blur-lg text-center`}>
        <h1 className={`text-3xl font-bold ${colors.text} mb-4`}>
          Selamat Datang, Seller!
        </h1>
        <p className={`${colors.textMuted} text-lg`}>
          Dashboard penjual Darknessmerch
        </p>
      </div>
    </div>
  );
}
