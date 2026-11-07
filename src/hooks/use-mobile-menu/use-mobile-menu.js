import { useEffect, useRef, useState } from 'react'
import { DESKTOP_MENU_QUERY } from '@/constants'

export function useMobileMenu() {
  const dialogRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MENU_QUERY)

    const closeOnDesktop = (event) => {
      if (event.matches) dialogRef.current?.close()
    }

    desktopQuery.addEventListener('change', closeOnDesktop)

    return () => desktopQuery.removeEventListener('change', closeOnDesktop)
  }, [])

  const openMenu = () => {
    dialogRef.current.showModal()
    setIsOpen(true)
  }

  const closeMenu = () => dialogRef.current.close()

  const toggleMenu = () => (isOpen ? closeMenu() : openMenu())

  const handleClose = () => setIsOpen(false)

  const handleDialogClick = (event) => {
    if (event.target === event.currentTarget) closeMenu()
  }

  return {
    dialogRef,
    isOpen,
    toggleMenu,
    closeMenu,
    handleClose,
    handleDialogClick,
  }
}
