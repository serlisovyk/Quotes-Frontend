'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { BurgerButton } from '@/components/burger-button'
import { MenuItems } from '@/components/menu-items'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)

  const mobileMenuId = 'mobile-navigation'

  return (
    <header>
      <nav aria-label="Primary" className="bg-white dark:bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <Link
            href="/"
            className="flex items-center gap-3 sm:gap-7"
            onClick={closeMenu}
          >
            <Image
              className="-m-2 w-16 sm:ml-5"
              src="/nav-icon.png"
              width={200}
              height={200}
              alt="Quotes App Icon"
              priority
            />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Quotes App
            </h1>
          </Link>

          <BurgerButton
            isOpen={isOpen}
            toggleMenu={toggleMenu}
            controls={mobileMenuId}
          />

          {isOpen && (
            <>
              <div
                id={mobileMenuId}
                aria-label="Mobile navigation"
                className="fixed top-0 right-0 h-full w-3/4 translate-x-0 transition-transform duration-500 ease-in-out z-40 bg-gradient-to-r from-transparent to-white dark:from-transparent dark:to-gray-800"
              >
                <div className="flex pr-5 pt-7 flex-col items-end justify-center space-y-6 text-2xl">
                  <BurgerButton
                    isOpen={isOpen}
                    toggleMenu={toggleMenu}
                    controls={mobileMenuId}
                  />
                  <MenuItems closeMenu={closeMenu} />
                </div>
              </div>

              <button
                type="button"
                aria-label="Close mobile navigation"
                className="fixed left-0 top-0 z-30 h-full w-full cursor-pointer bg-black opacity-80 transition-all duration-200 md:hidden"
                onClick={toggleMenu}
              />
            </>
          )}

          <div className="hidden md:flex space-x-8 pl-10 lg:pl-20 text-xl">
            <MenuItems />
          </div>
        </div>
      </nav>
    </header>
  )
}
