import { useContext, useEffect, useState } from "react";
import { CgMoon, CgSun, CgTrash } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { HiMinus, HiPlus, HiX } from "react-icons/hi";
import ThemeContext from "../contex/ThemeContext";
import AddToCardContext from "../contex/AddToCardContext";

const Header = () => {
    const { theme, setTheme } = useContext(ThemeContext);
    const { cartItems, setCartItems, deleatFromCart } = useContext(AddToCardContext);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);

    useEffect(() => {
        if (!isCartOpen) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === "Escape") setIsCartOpen(false);
        };

        window.addEventListener("keydown", closeOnEscape);
        return () => window.removeEventListener("keydown", closeOnEscape);
    }, [isCartOpen]);

    const updateQuantity = (item, amount) => {
        setCartItems((items) => items
            .map((cartItem) => cartItem.id === item.id
                ? { ...cartItem, qty: cartItem.qty + amount }
                : cartItem)
            .filter((cartItem) => cartItem.qty > 0));
    };

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-30 border-b border-zinc-200/80 bg-white/90 text-zinc-900 shadow-sm shadow-zinc-900/5 backdrop-blur-xl transition-colors duration-300 dark:border-zinc-800/80 dark:bg-zinc-950/90 dark:text-zinc-100">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-4">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            aria-label={`فتح سلة التسوق، ${totalItems} منتجات`}
                            aria-haspopup="dialog"
                            aria-expanded={isCartOpen}
                            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-amber-400"
                        >
                            <FaShoppingCart size={19} aria-hidden="true" />
                            {totalItems > 0 && (
                                <span aria-live="polite" className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-zinc-950">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            aria-label={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
                            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 text-zinc-700 transition hover:border-amber-500/60 hover:bg-amber-500/10 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-zinc-700 dark:text-amber-400"
                        >
                            {theme === "dark"
                                ? <CgSun size={21} aria-hidden="true" />
                                : <CgMoon size={21} aria-hidden="true" />}
                        </button>
                    </div>

                    <div className="text-center">
                        <h1 className="font-serif text-2xl font-semibold leading-tight text-amber-700 dark:text-amber-500 md:text-4xl">
                            عطارد
                        </h1>
                        <p className="mt-1 hidden text-xs text-zinc-600 dark:text-zinc-400 sm:block md:text-sm">
                            للفخامة عطر.. وللأصالة حكاية
                        </p>
                    </div>

                    <div className="w-[5.75rem] text-left text-[10px] font-medium text-zinc-500 sm:w-24 md:text-xs">
                        عطور مختارة بعناية
                    </div>
                </div>
            </header>

            {isCartOpen && (
                <div className="fixed inset-0 z-50 bg-zinc-950/50 backdrop-blur-sm" onMouseDown={(event) => {
                    if (event.target === event.currentTarget) setIsCartOpen(false);
                }}>
                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-title"
                        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-zinc-200 bg-white text-zinc-900 shadow-2xl animate-slide-in dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                    >
                        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-5 dark:border-zinc-800">
                            <div>
                                <h2 id="cart-title" className="font-serif text-2xl font-semibold">سلة التسوق</h2>
                                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                    {totalItems} {totalItems === 1 ? "منتج" : "منتجات"}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(false)}
                                aria-label="إغلاق السلة"
                                className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:hover:bg-zinc-800 dark:hover:text-white"
                            >
                                <HiX size={22} aria-hidden="true" />
                            </button>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                                <span className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                    <FaShoppingCart size={30} aria-hidden="true" />
                                </span>
                                <h3 className="text-lg font-semibold">السلة فارغة حاليًا</h3>
                                <p className="mt-2 max-w-xs text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                                    تصفّح مجموعتنا واختر العطور التي تناسب ذوقك.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsCartOpen(false)}
                                    className="mt-6 rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-amber-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
                                >
                                    متابعة التسوق
                                </button>
                            </div>
                        ) : (
                            <>
                                <ul className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                                    {cartItems.map((item) => (
                                        <li key={item.id} className="flex gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/70">
                                            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white dark:bg-zinc-800">
                                                {item.image?.url
                                                    ? <img src={item.image.url} alt="" className="h-full w-full object-contain p-2" loading="lazy" />
                                                    : <FaShoppingCart className="text-zinc-400" aria-hidden="true" />}
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <h3 className="line-clamp-2 text-sm font-semibold leading-5">{item.name}</h3>
                                                        {item.brand?.name && (
                                                            <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">{item.brand.name}</p>
                                                        )}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleatFromCart(item)}
                                                        aria-label={`حذف ${item.name} من السلة`}
                                                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-zinc-400 transition hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:hover:text-red-400"
                                                    >
                                                        <CgTrash size={17} aria-hidden="true" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-3 self-start rounded-full border border-zinc-200 bg-white px-1 dark:border-zinc-700 dark:bg-zinc-950">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item, -1)}
                                                        aria-label={`تقليل كمية ${item.name}`}
                                                        className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-600 transition hover:bg-amber-500/10 hover:text-amber-700 dark:text-zinc-300 dark:hover:text-amber-400"
                                                    >
                                                        <HiMinus size={14} aria-hidden="true" />
                                                    </button>
                                                    <span aria-live="polite" className="min-w-4 text-center text-xs font-semibold">{item.qty}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item, 1)}
                                                        aria-label={`زيادة كمية ${item.name}`}
                                                        className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-600 transition hover:bg-amber-500/10 hover:text-amber-700 dark:text-zinc-300 dark:hover:text-amber-400"
                                                    >
                                                        <HiPlus size={14} aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="border-t border-zinc-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-zinc-800 sm:p-5">
                                    <div className="mb-4 flex items-center justify-between text-sm">
                                        <span className="text-zinc-500 dark:text-zinc-400">إجمالي القطع</span>
                                        <span className="font-semibold">{totalItems}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setCartItems([])}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-900/70 dark:text-red-400 dark:hover:bg-red-950/40"
                                    >
                                        إفراغ السلة <CgTrash size={17} aria-hidden="true" />
                                    </button>
                                </div>
                            </>
                        )}
                    </aside>
                </div>
            )}
        </>
    );
};

export default Header;
