'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import navIcon from '@public/navIcon.png'
import BurgerButton from '@components/BurgerButton'
import MenuItems from '@components/MenuItems'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => setIsOpen(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)

  return (
    <nav className="bg-white dark:bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <Link href="/">
          <div className="flex items-center gap-3 sm:gap-7">
            <Image
              className="-m-2 w-16 sm:ml-5"
              src={navIcon}
              alt="Quotes App Icon"
            />
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Quotes App
            </h1>
          </div>
        </Link>

        <BurgerButton isOpen={isOpen} toggleMenu={toggleMenu} />

        <div
          className={`fixed top-0 right-0 h-full w-3/4 transform ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          } transition-transform duration-500 ease-in-out z-40 bg-gradient-to-r from-transparent to-white dark:from-transparent dark:to-gray-800`}
        >
          <div className="flex pr-5 pt-7 flex-col items-end justify-center space-y-6 text-2xl">
            <BurgerButton isOpen={isOpen} toggleMenu={toggleMenu} />
            <MenuItems closeMenu={closeMenu} />
          </div>
        </div>

        {
          <div
            className={`${
              isOpen ? 'opacity-80 w-full' : 'opacity-0 w-0 '
            } transition-all duration-200 fixed h-full left-0 top-0 z-30 bg-black md:hidden`}
            onClick={toggleMenu}
          />
        }

        <div className="hidden md:flex space-x-8 pl-10 lg:pl-20 text-xl">
          <MenuItems />
        </div>
      </div>
    </nav>
  )
}
