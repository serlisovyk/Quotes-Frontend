export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-5 px-2 md:px-0 bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
      <div className="text-center text-md font-bold">
        {currentYear} © Serhii Lisovyk
      </div>
    </footer>
  )
}
