
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

export default function Header() {
  const { isAuthenticated, user } = useAuth();
  const { colors, glass } = useTheme();

  return (
    <header className={`flex justify-end p-4 ${glass.background} ${glass.border} ${colors.text} backdrop-blur-lg shadow-lg`}>
      {isAuthenticated && (
        <div className="flex items-center text-sm space-x-4">
          <div className={`px-3 py-2 rounded-full ${colors.surfaceSecondary} font-medium`}>
            <span>Halo, {user.email}</span>
          </div>
        </div>
      )}
    </header>
  );
}
