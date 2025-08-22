export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          About Racket Tracker
        </h1>
        <div className="prose prose-lg mx-auto text-gray-600">
          <p>
            Racket Tracker is a lightweight stringing order intake & workflow
            tool. It started as a kiosk-friendly form for a local pro shop that
            needed an easier way to capture customer details and move jobs
            through simple statuses without committing to a backend early.
          </p>
          <p>
            The goal: reduce friction at the counter, improve communication, and
            prepare for an eventual sync-enabled backend. Everything you see is
            intentionally minimal so you can extend it quickly.
          </p>
        </div>
      </div>
    </div>
  );
}
