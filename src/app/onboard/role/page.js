import { SearchRole } from "@/components/search-role"

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="container px-4 py-12 md:px-6">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            What role would you like to play?
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">Search or select from roles within the Hotel Industry below</p>
          <SearchRole />
        </div>
      </div>
    </main>
  )
}
