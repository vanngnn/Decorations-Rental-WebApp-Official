import { Navbar } from "@/components/Navbar";
import { Pill } from "@/components/Pill";

const EVENTS = [
  "Weddings",
  "Proposal",
  "Bridal Shower",
  "Baby Shower",
  "Graduation",
  "Birthdays",
  "Corporate",
  "Engagement",
];

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-[#faf7f2]">
      <Navbar />

      <div className="px-10 pt-24">
        <h1 className="text-6xl font-semibold text-center">
          Can’t wait. Which one is it?
        </h1>

        <div className="max-w-5xl mx-auto mt-16 grid grid-cols-4 gap-10">
          {EVENTS.map((e) => (
            <Pill key={e} className="py-4 text-base">
              {e}
            </Pill>
          ))}
        </div>
      </div>
    </main>
  );
}
