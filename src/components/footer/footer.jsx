export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-5 px-2 md:px-0 bg-panel text-body">
      <div className="text-center text-md font-bold">
        {currentYear} &copy; Serhii Lisovyk
      </div>
    </footer>
  )
}
