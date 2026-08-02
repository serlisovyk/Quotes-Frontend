export default function BurgerButton({ isOpen, toggleMenu }) {
  return (
    <button
      onClick={toggleMenu}
      className="ml-auto text-gray-800 dark:text-white focus:outline-none md:hidden"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
        />
      </svg>
    </button>
  )
}
