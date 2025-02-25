import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="container px-4 py-12 md:px-6">
        <div className="mx-auto max-w-3xl space-y-8 text-center">
          <h1 className="text-3xl font-medium tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Welcome to InterContinental Denver.
          </h1>
          <p className="text-lg text-gray-600 md:text-xl">
            We are thrilled to have you join our front desk assisting guests at our prestigious hotel.
            We hope you'll help our guests feel warm and welcome.
            Your responsibilities will include:
            Greeting and checking in guests with professionalism and hospitality.
            Handling reservations, cancellations, and special requests.
            Assisting guests with inquiries about the hotel and local attractions.
            Processing payments and maintaining accurate records.
            Coordinating with other departments to ensure a seamless guest experience.

            To help you succeed, here are some key team members you’ll be working with:
            Ursula Khan
            Front Desk Manager - Your direct supervisor, who will guide and support you.
            Julia Lopez
            Housekeeping Manager - Ensures rooms and public spaces are clean and well-maintained.
            Natasha Popova
            Food and Beverage Manager - Manages the restaurant, bar, and room service operations.
            Bryan Smith
            Maintenance Associate - Handles repairs and ensures the property is in top condition.
            Sandy Anong
            Accounting Associate - Oversees billing, payments, and financial matters.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <button
                onClick={() => {
                router.push('/main/day1')
              }}
              className="rounded-xl border border-gray-200 p-6 text-left transition-colors hover:bg-gray-50"
            >
              <h3 className="font-medium text-gray-900">Start</h3>
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
