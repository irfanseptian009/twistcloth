import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { auth } from '../config/firebase'
import { Navigate } from 'react-router'
import { signOut } from 'firebase/auth'
import { useTheme } from '../contexts/ThemeContext'
import { ThemeToggle } from './UI/ThemeToggle'

const navigation = [
  { name: 'Dashboard', href: '/seller', current: true },
  { name: 'Products', href: '/seller/products', current: false },
  { name: 'Werehouse', href: '#', current: false },
  { name: 'Delivery', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    Navigate("/signin");
   } catch (error) {
      console.log(error)
    }
  }

export default function Example() {
  const { colors, glass, button } = useTheme();
  
  return (
    <Disclosure as="nav" className={`${colors.surface} ${glass.border} shadow-lg`}>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <DisclosureButton className={`group relative inline-flex items-center justify-center rounded-md p-2 ${colors.textMuted} ${button.ghost}`}>
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
              <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
            </DisclosureButton>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex shrink-0 items-center">
              <div className={`text-xl font-bold ${colors.text}`}>
                      Darknessmerch
                    </div>
            </div>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    aria-current={item.current ? 'page' : undefined}
                    className={classNames(
                      item.current 
                        ? `${colors.primary} ${colors.text}` 
                        : `${colors.textMuted} hover:${colors.surfaceSecondary} hover:${colors.text}`,
                      'rounded-md px-3 py-2 text-sm font-medium transition-all duration-200',
                    )}
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* Theme Toggle */}
            <div className="mr-3">
              <ThemeToggle variant="inline" size="sm" />
            </div>
            
            <button
              type="button"
              className={`relative rounded-full ${colors.surface} p-1 ${colors.textMuted} hover:${colors.text} focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200`}
            >
              <span className="absolute -inset-1.5" />
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative ml-3">
              <div>
                <MenuButton className={`relative flex rounded-full ${colors.surface} text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 hover:scale-105`}>
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">Open user menu</span>
                  <img
                    alt=""
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="size-8 rounded-full"
                  />
                </MenuButton>
              </div>
              <MenuItems
                transition
                className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md ${glass.background} ${glass.border} py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in`}
              >
                <MenuItem>
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${colors.text} data-[focus]:${colors.surfaceSecondary} data-[focus]:outline-none transition-colors duration-200`}
                  >
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className={`block px-4 py-2 text-sm ${colors.text} data-[focus]:${colors.surfaceSecondary} data-[focus]:outline-none transition-colors duration-200`}
                  >
                    Settings
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={handleLogout}
                    className={`block w-full text-left px-4 py-2 text-sm ${colors.text} data-[focus]:${colors.surfaceSecondary} data-[focus]:outline-none transition-colors duration-200`}
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="a"
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
              className={classNames(
                item.current 
                  ? `${colors.primary} ${colors.text}` 
                  : `${colors.textMuted} hover:${colors.surfaceSecondary} hover:${colors.text}`,
                'block rounded-md px-3 py-2 text-base font-medium transition-all duration-200',
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
