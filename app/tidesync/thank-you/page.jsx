import Link from 'next/link';

export default function TideSyncThankYouPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16 bg-slate-50 pt-24">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Thank you for your purchase!</h1>
        <p className="text-slate-600 mb-8">
          Your TideSync plan is now active. Open TideSync with the same account you used at checkout.
        </p>
        <Link
          href="https://tidesync.slpmicrosystems.com/"
          className="inline-block py-3 px-6 bg-teal text-white font-semibold rounded-lg hover:bg-teal-dark transition-colors"
        >
          Open TideSync
        </Link>
        <p className="mt-6">
          <Link href="/products/tidesync" className="text-slate-600 hover:text-teal text-sm">
            ← Back to TideSync
          </Link>
        </p>
      </div>
    </main>
  );
}
