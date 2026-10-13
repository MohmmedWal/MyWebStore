export default async function handler(request, response) {
    if (request.method !== "GET") {
        response.setHeader("Allow", "GET");
        return response.status(405).json({ error: "الطريقة غير مدعومة." });
    }

    const rapidApiKey = globalThis.process?.env?.RAPIDAPI_KEY;
    if (!rapidApiKey) {
        console.error("RAPIDAPI_KEY is not configured.");
        return response.status(503).json({
            error: "مفتاح RapidAPI غير مضاف. محليًا أضف RAPIDAPI_KEY إلى .env.local ثم أعد تشغيل npm run dev. على Vercel أضفه في Environment Variables ثم أعد النشر.",
        });
    }

    try {
        const apiResponse = await fetch("https://fragrance-api.p.rapidapi.com/indexes/fragrances_en/search", {
            method: "POST",
            headers: {
                "x-rapidapi-key": rapidApiKey,
                "x-rapidapi-host": "fragrance-api.p.rapidapi.com",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filter: 'topNotes.name = "Bergamot" AND status = published',
                limit: 20,
                q: "",
                sort: ["popularityScore:desc"],
            }),
        });

        if (!apiResponse.ok) {
            console.error(`Fragrance API returned HTTP ${apiResponse.status}.`);
            return response.status(502).json({ error: "تعذر الاتصال بمصدر بيانات العطور. حاول مرة أخرى لاحقًا." });
        }

        const data = await apiResponse.json();
        if (!Array.isArray(data.hits)) {
            console.error("Fragrance API returned an invalid response.");
            return response.status(502).json({ error: "وصلتنا بيانات غير صالحة من مصدر العطور." });
        }

        response.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
        return response.status(200).json({ hits: data.hits });
    } catch (error) {
        console.error("Failed to fetch fragrance data:", error);
        return response.status(502).json({ error: "تعذر تحميل بيانات العطور حاليًا." });
    }
}
