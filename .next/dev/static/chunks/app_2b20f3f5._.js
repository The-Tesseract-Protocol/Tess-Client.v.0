(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/components/ui/interactive-scrolling.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
// --- Data for each slide ---
const slidesData = [
    {
        title: "Generate Code with AI",
        description: "Describe your logic in plain English and watch as the AI generates clean, efficient code in seconds. From Python scripts to complex algorithms.",
        image: "https://images.unsplash.com/photo-1564865878688-9a244444042a?q=80&w=2070&auto=format&fit=crop",
        bgColor: "#F5E7C6",
        textColor: "#000000"
    },
    {
        title: "Debug and Refactor Smarter",
        description: "Paste your buggy code and let the AI identify errors, suggest improvements, and refactor for better readability and performance.",
        image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=2070&auto=format&fit=crop",
        bgColor: "#F5E7C6",
        textColor: "#000000"
    },
    {
        title: "Learn New Languages, Instantly",
        description: "Translate code snippets between languages. Understand syntax and paradigms of a new language by seeing familiar code transformed.",
        image: "https://images.unsplash.com/photo-1608306448197-e83633f1261c?q=80&w=1974&auto=format&fit=crop",
        bgColor: "#F5E7C6",
        textColor: "#000000"
    },
    {
        title: "Automate Your Workflow",
        description: "From writing documentation to generating unit tests, let AI handle the repetitive tasks so you can focus on building great things.",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop",
        bgColor: "#F5E7C6",
        textColor: "#000000"
    }
];
// --- Main App Component ---
const ScrollingFeatureShowcase = ()=>{
    _s();
    // State to track the currently active slide index
    const [activeIndex, setActiveIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    // Ref to the main scrollable container
    const scrollContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Ref to the sticky content panel
    const stickyPanelRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // --- Scroll Handler ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ScrollingFeatureShowcase.useEffect": ()=>{
            const container = scrollContainerRef.current;
            if (!container) return;
            const handleScroll = {
                "ScrollingFeatureShowcase.useEffect.handleScroll": ()=>{
                    const scrollableHeight = container.scrollHeight - window.innerHeight;
                    const stepHeight = scrollableHeight / slidesData.length;
                    const newActiveIndex = Math.min(slidesData.length - 1, Math.floor(container.scrollTop / stepHeight));
                    setActiveIndex(newActiveIndex);
                }
            }["ScrollingFeatureShowcase.useEffect.handleScroll"];
            container.addEventListener('scroll', handleScroll);
            return ({
                "ScrollingFeatureShowcase.useEffect": ()=>container.removeEventListener('scroll', handleScroll)
            })["ScrollingFeatureShowcase.useEffect"];
        }
    }["ScrollingFeatureShowcase.useEffect"], []);
    // Dynamic styles for the background and text color transitions
    const dynamicStyles = {
        backgroundColor: slidesData[activeIndex].bgColor,
        color: slidesData[activeIndex].textColor,
        transition: 'background-color 0.7s ease, color 0.7s ease'
    };
    // Styles for the grid pattern on the right side
    const gridPatternStyle = {
        '--grid-color': 'rgba(0, 0, 0, 0.12)',
        backgroundImage: `
      linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
      linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
    `,
        backgroundSize: '3.5rem 3.5rem'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: scrollContainerRef,
        className: "h-screen w-full overflow-y-auto",
        style: {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                height: `${slidesData.length * 100}vh`
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: stickyPanelRef,
                className: "sticky top-0 h-screen w-full flex flex-col items-center justify-center",
                style: dynamicStyles,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 h-full w-full max-w-7xl mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative flex flex-col justify-center p-8 md:p-16 border-r border-black/10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-16 left-16 flex space-x-2",
                                    children: slidesData.map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                const container = scrollContainerRef.current;
                                                if (container) {
                                                    const scrollableHeight = container.scrollHeight - window.innerHeight;
                                                    const stepHeight = scrollableHeight / slidesData.length;
                                                    container.scrollTo({
                                                        top: stepHeight * index,
                                                        behavior: 'smooth'
                                                    });
                                                }
                                            },
                                            className: `h-1 rounded-full transition-all duration-500 ease-in-out ${index === activeIndex ? 'w-12 bg-black/80' : 'w-6 bg-black/20'}`,
                                            "aria-label": `Go to slide ${index + 1}`
                                        }, index, false, {
                                            fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                            lineNumber: 96,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                    lineNumber: 94,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative h-64 w-full",
                                    children: slidesData.map((slide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `absolute inset-0 transition-all duration-700 ease-in-out ${index === activeIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-5xl md:text-6xl font-bold tracking-tighter",
                                                    children: slide.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                                    lineNumber: 124,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "mt-6 text-lg md:text-xl max-w-md",
                                                    children: slide.description
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, index, true, {
                                            fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                            lineNumber: 116,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                    lineNumber: 114,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-16 left-16",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: "#get-started",
                                        className: "px-10 py-4 bg-black text-white font-semibold rounded-full uppercase tracking-wider hover:bg-gray-800 transition-colors",
                                        children: "Get Started"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                        lineNumber: 132,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                    lineNumber: 131,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                            lineNumber: 92,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden md:flex items-center justify-center p-8",
                            style: gridPatternStyle,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative w-[50%] h-[80vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-black/5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out",
                                    style: {
                                        transform: `translateY(-${activeIndex * 100}%)`
                                    },
                                    children: slidesData.map((slide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-full h-full",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: slide.image,
                                                alt: slide.title,
                                                className: "h-full w-full object-cover",
                                                onError: (e)=>{
                                                    const target = e.target;
                                                    target.onerror = null;
                                                    target.src = `https://placehold.co/800x1200/e2e8f0/4a5568?text=Image+Not+Found`;
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                                lineNumber: 150,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, index, false, {
                                            fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                            lineNumber: 149,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                    lineNumber: 144,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                                lineNumber: 143,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                    lineNumber: 89,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
                lineNumber: 88,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
            lineNumber: 87,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/ui/interactive-scrolling.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ScrollingFeatureShowcase, "UjJJcfoIX7tUHAwzWqYEXPGwqlk=");
_c = ScrollingFeatureShowcase;
const __TURBOPACK__default__export__ = ScrollingFeatureShowcase;
var _c;
__turbopack_context__.k.register(_c, "ScrollingFeatureShowcase");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/landing/AnimatedHeadline.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnimatedHeadline",
    ()=>AnimatedHeadline
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
const AnimatedHeadline = ({ text, className = '', delay = 0 })=>{
    _s();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const ref = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedHeadline.useEffect": ()=>{
            const timer = setTimeout({
                "AnimatedHeadline.useEffect.timer": ()=>{
                    setIsVisible(true);
                }
            }["AnimatedHeadline.useEffect.timer"], delay);
            return ({
                "AnimatedHeadline.useEffect": ()=>clearTimeout(timer)
            })["AnimatedHeadline.useEffect"];
        }
    }["AnimatedHeadline.useEffect"], [
        delay
    ]);
    const letters = text.split('');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: ref,
        className: `inline-block ${className}`,
        children: letters.map((letter, index)=>{
            const randomDelay = Math.random() * 0.8;
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-block transition-all duration-500",
                style: {
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: isVisible ? `${randomDelay}s` : '0s'
                },
                children: letter === ' ' ? '\u00A0' : letter
            }, index, false, {
                fileName: "[project]/app/landing/AnimatedHeadline.tsx",
                lineNumber: 29,
                columnNumber: 11
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/app/landing/AnimatedHeadline.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AnimatedHeadline, "7N8EcRPlcY6o9kzg5IgMZgWhyLI=");
_c = AnimatedHeadline;
var _c;
__turbopack_context__.k.register(_c, "AnimatedHeadline");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_2b20f3f5._.js.map