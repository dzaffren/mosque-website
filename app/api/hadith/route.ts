import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 1. Generate a "Daily Seed" based on today's date
    const now = new Date();
    const seed = now.getFullYear() * 1000 + (now.getMonth() + 1) * 100 + now.getDate();

    // 2. Pick a Hadith Number (1 - 42)
    const seededRandom = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // We add 1 because the API is 1-indexed
    const hadithNumber = Math.floor(seededRandom(seed) * 42) + 1;

    // 3. Fetch English and Arabic
    const [engRes, araRes] = await Promise.all([
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-nawawi/${hadithNumber}.json`),
      fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-nawawi/${hadithNumber}.json`)
    ]);

    if (!engRes.ok || !araRes.ok) throw new Error('Failed to fetch Hadith');

    const engData = await engRes.json();
    const araData = await araRes.json();

    // 4. CLEANER FUNCTION (The Fix)
    // This removes all HTML tags (like <br>) and extra spaces
    const cleanText = (text: string) => {
      return text
        .replace(/<[^>]+>/g, '') // Regex to remove ALL HTML tags
        .replace(/\s+/g, ' ')    // Replace multiple spaces with a single space
        .trim();
    };

    // 5. Return formatted data with CLEAN text
    return NextResponse.json({
      arabic: cleanText(araData.hadiths[0].text),
      translation: cleanText(engData.hadiths[0].text),
      reference: `40 Hadith Nawawi, Hadith ${hadithNumber}`
    });

  } catch (error) {
    console.error("Hadith API Error:", error);
    return NextResponse.json(
      { 
        arabic: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ", 
        translation: "Actions are but by intentions and every man shall have but that which he intended.", 
        reference: "40 Hadith Nawawi, Hadith 1" 
      },
      { status: 500 }
    );
  }
}