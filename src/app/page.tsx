export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 dark:bg-black">
      <section className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Career Talk
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Frontend em Next.js para explorar talks, carreiras e trilhas de aprendizado.
        </p>
      </section>
    </main>
  );
}
