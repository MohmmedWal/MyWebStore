import { useState, useEffect } from 'react';
import Header from './components/Header';
import ThemeProvider from './contex/ThemeProvider';
import AddToCardProvider from './contex/AddToCardProvider';
import ProductContainer from './components/ProdectContener';


const App = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/perfumes', {
      method: 'GET',
      signal: controller.signal,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
        if (!Array.isArray(data.hits)) throw new Error('استجابة غير صالحة من خادم العطور');
        return data.hits;
      })
      .then((hits) => {
        setPerfumes(hits);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('خطأ في جلب البيانات:', err);
        setError(err.message || 'حدث خطأ أثناء تحميل العطور.');
        setLoading(false);
      });

    return () => controller.abort();
  }, [retryCount]);

  return (
    <AddToCardProvider>
      <ThemeProvider>
        <div
          className="min-h-screen p-4 pt-28 md:p-8 md:pt-32
                   bg-gradient-to-b from-white via-zinc-50 to-zinc-100 text-zinc-900
                   dark:from-zinc-950 dark:via-zinc-950 dark:to-black dark:text-zinc-100"
          dir="rtl"
        >
          <Header />

          {error && (
            <div role="alert" className="mx-auto mt-20 max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300">
              <p className="text-lg font-semibold">تعذر تحميل العطور</p>
              <p className="mt-2 text-sm leading-6">{error}</p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setRetryCount((count) => count + 1);
                }}
                className="mt-5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
              >
                إعادة المحاولة
              </button>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
                <p className="font-serif text-2xl tracking-widest text-amber-600 dark:text-amber-400 animate-shimmer">
                  تحميل العطور الفاخرة
                </p>
              </div>
            </div>
          )}

          {!loading && !error && (
            <ProductContainer
              perfumes={perfumes}
            />
          )}

          {!loading && !error && (
            <footer className="mt-24 pb-8 text-center">
              <div className="gold-divider w-32 mx-auto mb-6" />
              <p className="font-serif text-sm tracking-[0.3em] uppercase text-zinc-500 dark:text-zinc-600">
                Eng. Mohmmed Waled Salem @2026
              </p>
            </footer>
          )}
        </div>
      </ThemeProvider>
    </AddToCardProvider>
  );
};

export default App;