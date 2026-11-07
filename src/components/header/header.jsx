'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BurgerButton } from '@/components/burger-button'
import { MenuItems } from '@/components/menu-items'
import { ThemeSwitch } from '@/components/theme-switch'
import { useMobileMenu } from '@/hooks/use-mobile-menu'
import { MOBILE_MENU_CLASSES, MOBILE_MENU_ID, ROUTES } from '@/constants'

export function Header() {
  const {
    dialogRef,
    isOpen,
    toggleMenu,
    closeMenu,
    handleClose,
    handleDialogClick,
  } = useMobileMenu()

  return (
    <header>
      <nav aria-label="Primary" className="bg-panel p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-3 rounded-sm focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none sm:gap-7"
          >
            <Image
              className="-m-2 w-16 sm:ml-5"
              src="/nav-icon.png"
              width={200}
              height={200}
              alt="Quotes App Icon"
              priority
            />
            <span className="text-2xl font-bold text-body">Quotes App</span>
          </Link>

          <BurgerButton
            isOpen={isOpen}
            toggleMenu={toggleMenu}
            controls={MOBILE_MENU_ID}
          />

          <dialog
            ref={dialogRef}
            id={MOBILE_MENU_ID}
            aria-label="Mobile navigation"
            className={MOBILE_MENU_CLASSES}
            onClose={handleClose}
            onClick={handleDialogClick}
          >
            <div className="flex h-full flex-col items-end space-y-6 pt-7 pr-5 text-2xl">
              <BurgerButton
                isOpen={isOpen}
                toggleMenu={toggleMenu}
                controls={MOBILE_MENU_ID}
              />

              <MenuItems closeMenu={closeMenu} />
            </div>
          </dialog>

          <div className="hidden space-x-8 pl-10 text-xl md:flex lg:pl-20">
            <MenuItems />
          </div>

          <div className="ml-2 md:ml-auto">
            <ThemeSwitch />
          </div>
        </div>
      </nav>
    </header>
  )
}
