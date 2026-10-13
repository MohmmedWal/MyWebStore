import { useState, useEffect, useRef, useContext } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import AddToCardContext from "../contex/AddToCardContext";

/* 🎴 كارت واحد - له ref و observer خاص + index للتأخير */
const PerfumeCard = ({ item, index, onSelect }) => {
    const cardRef = useRef(null);
    const [visible, setVisible] = useState(
        () => typeof window === "undefined" || !("IntersectionObserver" in window)
    );
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useContext(AddToCardContext);

    useEffect(() => {
        const el = cardRef.current;
        if (!el || !("IntersectionObserver" in window)) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <article
            ref={cardRef}
            /* 👇 التأخير حسب ترتيب الكارت (ستاجر) */
            style={{ transitionDelay: visible ? `${index * 50}ms` : '0ms' }}
            className={`reveal-card glow-card ${visible ? 'is-visible' : ''}
                  group relative rounded-2xl overflow-hidden
                  bg-white dark:bg-zinc-900/80
                  border border-zinc-200 dark:border-zinc-800
                  hover:border-amber-500/40 dark:hover:border-amber-500/40
                  transition-transform duration-300
                  hover:-translate-y-2
                  hover:shadow-2xl hover:shadow-amber-500/10
                  dark:hover:shadow-amber-500/5
                  backdrop-blur-sm`}
        >

            {/* شارة الماركة */}
            <div className="absolute top-4 left-4 z-10">
                <span className="text-[10px] tracking-[0.25em] uppercase font-light
                         text-amber-700 dark:text-amber-400/90">
                    {item?.brand?.name}
                </span>
            </div>

            {/* صورة العطر */}
            <div className="relative flex justify-center items-center h-72 md:h-80 p-8
                    bg-gradient-to-b from-zinc-50 to-zinc-100
                    dark:from-zinc-900 dark:to-zinc-950">

                {/* الهالة */}
                <div className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-40 h-40 rounded-full blur-3xl bg-amber-500/10" />
                </div>

                {item.image?.url && (
                    <img
                        src={item.image.url}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="relative max-h-full max-w-full object-contain
                    drop-shadow-xl dark:drop-shadow-[0_10px_30px_rgba(245,158,11,0.15)]"
                    />
                )}

                <div className="gold-divider absolute bottom-0 left-8 right-8" />
                {/* زر عرض المزيد */}
                <div className="absolute bottom-4 right-4">

                    {/* السهم — peer، ثابت تماماً */}
                    {/* السهم — peer + group مسمّى */}
                    <button type="button" aria-label={`عرض تفاصيل ${item.name}`} className="peer group/arrow cursor-pointer
                flex items-center justify-center
                h-9 w-9 rounded-full
                bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm
                border border-amber-300/50 shadow-sm
                transition-all duration-300 ease-in-out
                hover:translate-y-1
                hover:bg-amber-500/60
                hover:shadow-lg hover:shadow-amber-500/30"
                        onClick={() => onSelect(item)}
                    >
                        <FaChevronDown className="h-4 w-4
                            text-zinc-700 dark:text-zinc-200
                            transition-colors duration-300
                            group-hover/arrow:text-white" />
                    </button>

                    {/* النص — absolute تحت السهم، ما يأثر على مكانه */}
                    <div className="absolute right-9 -bottom-2
                    pointer-events-none
                    overflow-hidden whitespace-nowrap
                    max-w-0 opacity-0
                    transition-all duration-500 ease-out
                    peer-hover:max-w-[160px]
                    peer-hover:opacity-100">
                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                            عرض المزيد
                        </span>
                    </div>
                </div>
            </div>

            {/* التفاصيل */}
            <div className="p-6 pt-5">
                <h3 className="font-serif text-xl mb-1 tracking-wide line-clamp-2 min-h-[3.5rem]
                       text-zinc-900 dark:text-amber-50">
                    {item.name}
                </h3>

                <p className="text-[11px] tracking-[0.2em] uppercase mb-5 line-clamp-1
                      text-zinc-500 dark:text-zinc-500">
                    {item?.notes?.slice(0, 3).map((n) => n.name).join(' · ')}
                </p>

                <div className="gold-divider w-12 mb-4" />

                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1.5">
                        <span className="text-amber-500 text-sm tracking-tight">★★★★★</span>
                        <span className="text-amber-700 dark:text-amber-400/90 text-sm font-medium tracking-wider">
                            {item.reviewsScoreAvg}
                        </span>
                    </div>
                    <span className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase">
                        {item.reviewsCount} reviews
                    </span>

                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-amber-500/40 text-amber-700 dark:text-amber-400">
                        <button
                            type="button"
                            aria-label="تقليل الكمية"
                            disabled={quantity === 1}
                            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                            className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition-colors hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            -
                        </button>
                        <span aria-live="polite" className="min-w-6 text-center text-sm">{quantity}</span>
                        <button
                            type="button"
                            aria-label="زيادة الكمية"
                            onClick={() => setQuantity((current) => current + 1)}
                            className="flex h-11 w-11 items-center justify-center rounded-full text-lg transition-colors hover:bg-amber-500/10"
                        >
                            +
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={() => {
                            addToCart(item, quantity);
                            setQuantity(1);
                        }}
                        className="flex-1 rounded-full border border-amber-500/40 py-3 text-xs font-light tracking-wider
                         text-amber-700 transition-all duration-300 hover:border-amber-500 hover:bg-amber-500
                         hover:text-black hover:shadow-lg hover:shadow-amber-500/30 dark:text-amber-400
                         cursor-pointer"
                    >
                        إضافة إلى السلة
                    </button>
                </div>
            </div>
        </article>
    );
};

/* 📦 الحاوية الرئيسية */
const ProductContainer = ({ perfumes = [], onAddToCart }) => {
    const [selectedPerfume, setSelectedPerfume] = useState(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = selectedPerfume ? 'hidden' : previousOverflow;
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [selectedPerfume]);

    useEffect(() => {
        const onKey = (e) => e.key === 'Escape' && setSelectedPerfume(null);
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    if (!perfumes || perfumes.length === 0) {
        return (
            <div className="text-center py-20 font-serif text-xl tracking-wider
                      text-zinc-500 dark:text-zinc-500">
                لا توجد عطور للعرض
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto mt-14">
                {perfumes.map((item, index) => (
                    <PerfumeCard
                        key={item.id}
                        item={item}
                        index={index}
                        onSelect={setSelectedPerfume}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>

            {/* المودال */}
            {selectedPerfume && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in
                     bg-black/60 dark:bg-black/85 backdrop-blur-md"
                    onClick={() => setSelectedPerfume(null)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="perfume-dialog-title"
                        onClick={(event) => event.stopPropagation()}
                        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 animate-zoom-in
                       bg-white dark:bg-zinc-900
                       border border-zinc-200 dark:border-amber-500/20
                       shadow-2xl dark:shadow-[0_0_60px_-15px_rgba(245,158,11,0.3)]"

                    >
                        <button
                            type="button"
                            onClick={() => setSelectedPerfume(null)}
                            aria-label="إغلاق تفاصيل العطر"
                            className="absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center
                         text-zinc-500 dark:text-zinc-400
                         hover:text-amber-500 dark:hover:text-amber-400
                         hover:bg-zinc-100 dark:hover:bg-zinc-800
                         transition-all cursor-pointer"
                        >
                            ✕
                        </button>

                        <div className="relative h-80 w-full mb-6 flex justify-center items-center rounded-xl p-4
                            bg-gradient-to-b from-zinc-100 to-zinc-50
                            dark:from-zinc-950 dark:to-zinc-900">
                            <div className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                w-56 h-56 rounded-full blur-3xl bg-amber-500/15" />
                            </div>
                            <img
                                src={selectedPerfume.image?.url}
                                alt={selectedPerfume.name}
                                className="relative max-h-full object-contain rounded-lg
                           drop-shadow-2xl dark:drop-shadow-[0_15px_40px_rgba(245,158,11,0.2)]"
                            />
                        </div>

                        <h2 id="perfume-dialog-title" className="font-serif font-bold text-2xl text-center mb-1 tracking-wide
                           text-zinc-900 dark:text-amber-50">
                            {selectedPerfume.name}
                        </h2>
                        <p className="text-center text-[11px] tracking-[0.3em] uppercase mb-6
                          text-zinc-500 dark:text-zinc-400">
                            {selectedPerfume.brand?.name}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-center mb-6">
                            {[
                                { label: 'التقييم', value: selectedPerfume.reviewsScoreAvg },
                                { label: 'الثبات', value: selectedPerfume.reviewStats?.scoreLongevity },
                                { label: 'الفوحان', value: selectedPerfume.reviewStats?.scoreSillage },
                                { label: 'القيمة', value: selectedPerfume.reviewStats?.scoreValueForMoney },
                            ].map((s, i) => (
                                <div
                                    key={i}
                                    className="p-3 rounded-lg border transition-colors
                             bg-zinc-50 dark:bg-zinc-800/50
                             border-zinc-200 dark:border-zinc-700/50"
                                >
                                    <div className="font-bold text-lg text-amber-600 dark:text-amber-400">
                                        {s.value}
                                    </div>
                                    <div className="text-[10px] tracking-wider uppercase mt-1 text-zinc-500">
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-3 text-sm mb-6">
                            {[
                                { label: 'Top', notes: selectedPerfume.topNotes },
                                { label: 'Middle', notes: selectedPerfume.middleNotes },
                                { label: 'Base', notes: selectedPerfume.baseNotes },
                            ].map((row, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <span className="w-16 shrink-0 font-bold tracking-wider text-xs uppercase
                                   text-amber-600 dark:text-amber-400">
                                        {row.label}
                                    </span>
                                    <span className="flex-1 text-zinc-700 dark:text-zinc-300">
                                        {row.notes?.map((n) => n.name).join(' · ')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-1.5 justify-center pt-4 border-t
                            border-zinc-200 dark:border-zinc-800">
                            {selectedPerfume.accords?.map((acc) => (
                                <span
                                    key={acc.id}
                                    style={{ backgroundColor: acc.backgroundColor, color: acc.textColor }}
                                    className="text-[10px] px-3 py-1 rounded-full tracking-wider font-medium"
                                >
                                    {acc.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductContainer;