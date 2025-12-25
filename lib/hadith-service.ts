// lib/hadith-service.ts

export async function getDailyHadith() {
  try {
    // 1. Generate a "Daily Seed" based on today's date
    const now = new Date();
    const seed = now.getFullYear() * 1000 + (now.getMonth() + 1) * 100 + now.getDate();

    // 2. Pick a Hadith Number (1 - 42) using a seeded random
    const seededRandom = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };
    
    const hadithNumber = Math.floor(seededRandom(seed) * 42) + 1;

    // 3. Fetch from the Hadith API (External, so it works during build)
    const [engRes, araRes] = await Promise.all([
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-nawawi/${hadithNumber}.json`),
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nawawi/${hadithNumber}.json`)
    ]);

    if (!engRes.ok || !araRes.ok) throw new Error('Failed to fetch external Hadith');

    const engData = await engRes.json();
    const araData = await araRes.json();

    const cleanText = (text: string) => {
      return text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    };

    return {
      arabic: cleanText(araData.hadiths[0].text),
      translation: cleanText(engData.hadiths[0].text),
      reference: `40 Hadith Nawawi, Hadith ${hadithNumber}`
    };

  } catch (error) {
    console.error("Hadith Service Error:", error);
    // Hardcoded fallback ONLY if the external API fails
    return {
      arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ",
      translation: "Actions are but by intentions.",
      reference: "40 Hadith Nawawi, Hadith 1"
    };
  }
}