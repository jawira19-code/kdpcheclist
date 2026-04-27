import React, { useMemo, useState } from "react";

// ===============================
// KDP DASHBOARD FULL VERSION + SMART PROFIT FILTER + AUTO BOOK FACTORY + SMART RESEARCH LINKS
// Checklist preserved exactly
// ===============================

function getDaySeed() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 100000;
  }
  return hash;
}

function pseudoRandom(seed, index) {
  const x = Math.sin(seed * 999 + index * 1234) * 10000;
  return x - Math.floor(x);
}

function generateDailyNiches(force = 0) {
  const seed = hashString(getDaySeed() + force);

  const base = [
    "Anxiety Relief Coloring Book",
    "ADHD Focus Workbook",
    "Cottagecore Aesthetic Coloring",
    "Dark Academia Coloring Book",
    "Cute Horror Chibi Book",
    "Sleep Therapy Coloring Pages",
    "Mindfulness Mandala Book",
    "Animal Coloring Book",
    "Fantasy Creatures Coloring",
    "Kawaii Coloring Book",
    "Minimalist Line Art",
    "Nature Coloring",
    "Ocean Life Coloring",
    "Botanical Coloring",
    "Fairy Tale Coloring",
    "Urban Sketch Coloring",
    "Motivational Quotes Coloring",
    "Fashion Coloring Book",
    "Cozy Lifestyle Coloring",
    "Cute Animals Coloring"
  ];

  return base
    .map((n, i) => {
      const trend = Math.floor(pseudoRandom(seed, i + 10) * 100);
      const competition = pseudoRandom(seed, i + 20) > 0.6 ? "Low" : "Medium";
      const score = Math.floor(pseudoRandom(seed, i) * 5 + 5);

      let opportunity = score;
      if (competition === "Low") opportunity += 2;
      if (trend > 70) opportunity += 2;

      const trendType = trend > 70 ? "Trending" : trend > 40 ? "Stable" : "Evergreen";

      let decision = "⚠️ Skip";
      if (competition === "Low" && trend > 50) decision = "🔥 Publish Now";
      else if (competition === "Low") decision = "✅ Good Opportunity";
      else if (trend > 70) decision = "⚡ Fast Trend";

      return { name: n, score, trend, competition, opportunity, trendType, decision };
    })
    .sort((a, b) => b.opportunity - a.opportunity);
}

function generateSubNiches(niche) {
  const seed = hashString(niche + getDaySeed());
  const pool = [
    "Mandala therapy pages",
    "Stress relief patterns",
    "Focus training workbook",
    "Mindfulness flow",
    "Aesthetic variations",
    "Daily relaxation",
    "Beginner friendly",
    "Advanced detail pages"
  ];

  return pool
    .map((item, i) => ({ item, sort: pseudoRandom(seed, i) }))
    .sort((a, b) => b.sort - a.sort)
    .slice(0, 3)
    .map((x) => x.item);
}

function generateKeywords(niche) {
  return [
    `${niche.toLowerCase()} aesthetic pages`,
    "cozy vintage nature scenes",
    "relaxing farmhouse vibes",
    "anti stress creative therapy",
    "slow living art activity",
    "mindfulness calm drawing",
    "rustic floral designs"
  ];
}

function generatePrompts(niche) {
  const base = "black and white coloring page, clean bold lines, no shading, white background, printable KDP interior";
  return Array.from({ length: 30 }).map((_, i) => `${niche} scene ${i + 1}, ${base}`);
}

function generateCoverPrompt(niche) {
  return `${niche} cover design, bold typography, eye-catching composition, high contrast, clean modern KDP book cover, professional bestselling style`;
}

function generateDescription(niche) {
  return `✨ Discover the Magic of ${niche}! ✨\n\nUnwind, relax, and express your creativity with this beautifully designed coloring book. Whether you are a beginner or an experienced colorist, this book offers a calming escape from stress and daily pressure.\n\n✔ Stress-relieving designs\n✔ Perfect for mindfulness and relaxation\n✔ Great gift idea for friends and family\n✔ High-quality pages for a premium experience\n\nStart your creative journey today and enjoy hours of peaceful coloring with ${niche}.`;
}

function generateBook(niche) {
  return {
    niche,
    title: `${niche}: Stress Relief Coloring Book for Adults`,
    subtitle: "Relaxing Designs for Mindfulness and Creativity",
    keywords: generateKeywords(niche),
    prompts: generatePrompts(niche),
    cover: generateCoverPrompt(niche),
    description: generateDescription(niche)
  };
}

function generateFactoryPack(niche) {
  const book = generateBook(niche);
  return {
    ...book,
    imagesStatus: "Image prompts ready — generate them in Leonardo / Midjourney / Ideogram",
    coverStatus: "Cover prompt ready — generate cover image in your AI image tool",
    pdfStatus: "PDF blueprint ready — export images as PDF using Canva / PowerPoint / Google Slides"
  };
}

function buildResearchLinks(niche) {
  const q = encodeURIComponent(niche);
  return {
    amazon: `https://www.amazon.com/s?k=${q}`,
    googleTrends: `https://trends.google.com/trends/explore?q=${q}`,
    etsy: `https://www.etsy.com/search?q=${q}`,
    pinterest: `https://www.pinterest.com/search/pins/?q=${q}`,
    google: `https://www.google.com/search?q=${q}+coloring+book+amazon+kdp`
  };
}

// ===============================
// CHECKLIST — KEEP UNCHANGED EXACTLY
// ===============================
function Checklist() {
  return (
    <div className="bg-gray-900 p-4 rounded mb-6 border border-gray-700">
      <h2 className="text-xl font-bold mb-2">🧠 KDP Dashboard</h2>
      <ul className="text-sm space-y-1 list-disc ml-5">
        <li>Daily 20 Niches Engine ACTIVE</li>
        <li>Auto Refresh every day</li>
        <li>Sub-niche generator ON</li>
        <li>Search system enabled</li>
        <li>Cover generator added</li>
        <li>Description generator added</li>
      </ul>
    </div>
  );
}

function DecisionBadge({ decision }) {
  const color = decision.includes("Publish")
    ? "bg-green-700"
    : decision.includes("Good")
    ? "bg-blue-700"
    : decision.includes("Fast")
    ? "bg-yellow-700"
    : "bg-red-700";

  return <span className={`${color} px-2 py-1 rounded text-xs font-bold`}>{decision}</span>;
}

function ResearchButtons({ niche }) {
  const links = buildResearchLinks(niche);

  const copyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  const items = [
    { label: "Amazon", url: links.amazon, color: "bg-orange-600 hover:bg-orange-500" },
    { label: "Google Trends", url: links.googleTrends, color: "bg-blue-600 hover:bg-blue-500" },
    { label: "Etsy", url: links.etsy, color: "bg-pink-600 hover:bg-pink-500" },
    { label: "Pinterest", url: links.pinterest, color: "bg-red-600 hover:bg-red-500" },
    { label: "Google Search", url: links.google, color: "bg-gray-700 hover:bg-gray-600" }
  ];

  return (
    <div className="mt-3 space-y-3">
      {items.map((item) => (
        <div key={item.label} className="flex flex-wrap gap-2 items-center bg-black p-2 rounded border border-gray-800">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${item.color} px-3 py-1 rounded text-xs font-bold inline-block`}
          >
            Open {item.label}
          </a>

          <button
            type="button"
            onClick={() => copyLink(item.url)}
            className="bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded text-xs"
          >
            Copy Link
          </button>

          <span className="text-xs text-gray-500 break-all w-full">{item.url}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("overview");
  const [refresh, setRefresh] = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [factoryPack, setFactoryPack] = useState(null);
  const [researchNiche, setResearchNiche] = useState(null);
  const [subMap, setSubMap] = useState({});
  const [copied, setCopied] = useState("");
  const [onlyWinners, setOnlyWinners] = useState(false);

  const niches = useMemo(() => generateDailyNiches(refresh), [refresh]);

  const visibleNiches = useMemo(() => {
    if (!onlyWinners) return niches;
    return niches.filter(
      (n) => n.decision === "🔥 Publish Now" || n.decision === "✅ Good Opportunity"
    );
  }, [niches, onlyWinners]);

  const toggleSub = (index, niche) => {
    setSubMap((prev) => ({
      ...prev,
      [index]: prev[index] ? null : generateSubNiches(niche)
    }));
  };

  const generateFromNiche = (niche) => {
    setSelectedBook(generateBook(niche));
    setTab("book");
  };

  const generateFromSub = (parentNiche, sub) => {
    setSelectedBook(generateBook(`${parentNiche} - ${sub}`));
    setTab("book");
  };

  const runFactoryFromNiche = (niche) => {
    setFactoryPack(generateFactoryPack(niche));
    setTab("factory");
  };

  const runFactoryFromSub = (parentNiche, sub) => {
    setFactoryPack(generateFactoryPack(`${parentNiche} - ${sub}`));
    setTab("factory");
  };

  const runResearch = (niche) => {
    setResearchNiche(niche);
    setTab("research");
  };

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">KDP Dashboard Full Preview 🚀</h1>

      <Checklist />

      {/* Smart Profit Filter — outside checklist */}
      <div className="bg-gray-900 p-4 rounded mb-6 border border-gray-700">
        <h2 className="text-lg font-bold mb-3">🔥 Smart Profit Filter</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setRefresh((r) => r + 1)}
            className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded"
          >
            🔄 Refresh Niches
          </button>
          <button
            onClick={() => setOnlyWinners((v) => !v)}
            className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded"
          >
            {onlyWinners ? "Show All Niches" : "🔥 Only Winning Niches"}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          يعرض النيتشات التي تستحق التجربة بناءً على Competition + Trend + Opportunity.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setTab("overview")} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded">Niche Overview</button>
        <button onClick={() => setTab("deep")} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded">Deep Dive</button>
        <button onClick={() => setTab("research")} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded">🔍 Smart Research</button>
        <button onClick={() => setTab("book")} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded">Book Generator</button>
        <button onClick={() => setTab("factory")} className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded">🤖 Auto Book Factory</button>
      </div>

      {tab === "overview" && (
        <div className="grid md:grid-cols-2 gap-3">
          {visibleNiches.map((n, i) => (
            <div key={i} className="bg-gray-900 p-3 rounded border border-gray-700">
              <div className="flex justify-between gap-2 items-start">
                <h3 className="font-bold">{n.name}</h3>
                <DecisionBadge decision={n.decision} />
              </div>
              <p>🎯 Score: {n.score}/10</p>
              <p>🔥 Trend: {n.trend}%</p>
              <p>⚔ Competition: {n.competition}</p>
              <p>💰 Opportunity: {n.opportunity}/10</p>

              <div className="flex flex-wrap gap-2 mt-2">
                <button className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-xs" onClick={() => generateFromNiche(n.name)}>
                  Generate Book
                </button>
                <button className="bg-green-600 hover:bg-green-500 px-2 py-1 rounded text-xs" onClick={() => toggleSub(i, n.name)}>
                  Sub Niches
                </button>
                <button className="bg-cyan-600 hover:bg-cyan-500 px-2 py-1 rounded text-xs" onClick={() => runResearch(n.name)}>
                  🔍 Research
                </button>
                <button className="bg-pink-600 hover:bg-pink-500 px-2 py-1 rounded text-xs" onClick={() => runFactoryFromNiche(n.name)}>
                  🤖 Factory
                </button>
              </div>

              {subMap[i] && (
                <ul className="mt-2 text-sm list-disc ml-5 space-y-2">
                  {subMap[i].map((s, idx) => (
                    <li key={idx} className="flex justify-between gap-3 items-center">
                      <span>{s}</span>
                      <div className="flex gap-2">
                        <button className="bg-yellow-600 hover:bg-yellow-500 px-2 py-1 text-xs rounded" onClick={() => generateFromSub(n.name, s)}>
                          Generate
                        </button>
                        <button className="bg-cyan-600 hover:bg-cyan-500 px-2 py-1 text-xs rounded" onClick={() => runResearch(`${n.name} - ${s}`)}>
                          Research
                        </button>
                        <button className="bg-pink-600 hover:bg-pink-500 px-2 py-1 text-xs rounded" onClick={() => runFactoryFromSub(n.name, s)}>
                          Factory
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "deep" && (
        <div className="grid md:grid-cols-2 gap-4">
          {visibleNiches.slice(0, 10).map((n, i) => (
            <div key={i} className="bg-gray-900 p-4 rounded border border-gray-700">
              <div className="flex justify-between gap-2 items-start">
                <h3 className="font-bold mb-2">{n.name}</h3>
                <DecisionBadge decision={n.decision} />
              </div>
              <p>🎯 Opportunity Score: {n.opportunity}/10</p>
              <p>📈 Trend: {n.trend}% ({n.trendType})</p>
              <p>⚔ Competition: {n.competition}</p>

              <div className="mt-3">
                <p className="font-bold text-sm">💡 Strategy:</p>
                <ul className="text-sm list-disc ml-5">
                  {n.trendType === "Trending" && <li>Publish fast because the trend is hot.</li>}
                  {n.trendType === "Stable" && <li>Balanced demand with long-term potential.</li>}
                  {n.trendType === "Evergreen" && <li>Good for slow and consistent passive income.</li>}
                  {n.competition === "Low" && <li>Better chance to rank quickly.</li>}
                  {n.competition === "Medium" && <li>Use a narrow sub-niche angle to compete.</li>}
                </ul>
              </div>

              <div className="mt-3">
                <p className="font-bold text-sm">🎯 Sub Niches:</p>
                <ul className="text-sm list-disc ml-5 space-y-2">
                  {generateSubNiches(n.name).map((s, idx) => (
                    <li key={idx} className="flex justify-between gap-3 items-center">
                      <span>{s}</span>
                      <div className="flex gap-2">
                        <button className="bg-yellow-600 hover:bg-yellow-500 px-2 py-1 text-xs rounded" onClick={() => generateFromSub(n.name, s)}>
                          Generate
                        </button>
                        <button className="bg-cyan-600 hover:bg-cyan-500 px-2 py-1 text-xs rounded" onClick={() => runResearch(`${n.name} - ${s}`)}>
                          Research
                        </button>
                        <button className="bg-pink-600 hover:bg-pink-500 px-2 py-1 text-xs rounded" onClick={() => runFactoryFromSub(n.name, s)}>
                          Factory
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "research" && !researchNiche && (
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          اختر نيتش من Niche Overview أو Deep Dive ثم اضغط 🔍 Research.
        </div>
      )}

      {tab === "research" && researchNiche && (
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          <h2 className="font-bold mb-3">🔍 Smart Research Dashboard</h2>
          <p><b>Selected niche:</b> {researchNiche}</p>
          <p className="text-sm text-gray-400 mt-2">
            هذه الروابط تفتح أدوات البحث مباشرة. لا تجلب بيانات تلقائيًا داخل الداشبورد، لكنها تسرّع التحقق اليدوي من السوق.
          </p>
          <ResearchButtons niche={researchNiche} />

          <div className="mt-4 bg-black p-3 rounded border border-gray-800 text-sm">
            <p><b>ما الذي تتحقق منه؟</b></p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Amazon: وجود كتب BSR منخفض ومراجعات ليست كثيرة.</li>
              <li>Google Trends: هل الاهتمام صاعد أو ثابت؟</li>
              <li>Etsy/Pinterest: هل هناك طلب بصري واهتمام بالستايل؟</li>
              <li>إذا وجدت منافسة ضخمة، استخدم Sub-niche أضيق.</li>
            </ul>
          </div>
        </div>
      )}

      {tab === "book" && !selectedBook && (
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          اختر نيتش من Niche Overview أو Deep Dive ثم اضغط Generate Book.
        </div>
      )}

      {tab === "book" && selectedBook && (
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          <h2 className="font-bold mb-3">Book Pack</h2>

          <p><b>Niche:</b> {selectedBook.niche}</p>

          <p className="mt-3"><b>Title:</b> {selectedBook.title}</p>
          <button className="bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => copy(selectedBook.title, "title")}>{copied === "title" ? "Copied!" : "Copy Title"}</button>

          <p className="mt-3"><b>Subtitle:</b> {selectedBook.subtitle}</p>
          <button className="bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => copy(selectedBook.subtitle, "subtitle")}>{copied === "subtitle" ? "Copied!" : "Copy Subtitle"}</button>

          <p className="mt-3"><b>Keywords:</b></p>
          <ul className="text-sm list-disc ml-5">
            {selectedBook.keywords.map((k, i) => <li key={i}>{k}</li>)}
          </ul>
          <button className="bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => copy(selectedBook.keywords.join(", "), "keywords")}>{copied === "keywords" ? "Copied!" : "Copy Keywords"}</button>

          <p className="mt-3"><b>Cover Prompt:</b></p>
          <p className="text-sm">{selectedBook.cover}</p>
          <button className="bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => copy(selectedBook.cover, "cover")}>{copied === "cover" ? "Copied!" : "Copy Cover Prompt"}</button>

          <p className="mt-3"><b>Description:</b></p>
          <p className="text-sm whitespace-pre-line">{selectedBook.description}</p>
          <button className="bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => copy(selectedBook.description, "description")}>{copied === "description" ? "Copied!" : "Copy Description"}</button>

          <p className="mt-3"><b>30 Prompts:</b></p>
          <div className="max-h-48 overflow-auto text-sm bg-black p-3 rounded border border-gray-800">
            {selectedBook.prompts.map((p, i) => <div key={i}>{i + 1}. {p}</div>)}
          </div>
          <button className="mt-2 bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => copy(selectedBook.prompts.join("\n"), "prompts")}>{copied === "prompts" ? "Copied!" : "Copy Prompts"}</button>
        </div>
      )}

      {tab === "factory" && !factoryPack && (
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          اختر نيتش من Niche Overview أو Deep Dive ثم اضغط 🤖 Factory.
        </div>
      )}

      {tab === "factory" && factoryPack && (
        <div className="bg-gray-900 p-4 rounded border border-gray-700">
          <h2 className="font-bold mb-3">🤖 Auto Book Factory</h2>
          <p><b>Niche:</b> {factoryPack.niche}</p>

          <div className="grid md:grid-cols-3 gap-3 mt-4">
            <div className="bg-black p-3 rounded border border-gray-800">
              <h3 className="font-bold">1) الصور</h3>
              <p className="text-sm text-gray-300">{factoryPack.imagesStatus}</p>
              <button className="mt-2 bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => copy(factoryPack.prompts.join("\n"), "factoryPrompts")}>{copied === "factoryPrompts" ? "Copied!" : "Copy Image Prompts"}</button>
            </div>

            <div className="bg-black p-3 rounded border border-gray-800">
              <h3 className="font-bold">2) الغلاف</h3>
              <p className="text-sm text-gray-300">{factoryPack.coverStatus}</p>
              <p className="text-xs mt-2">{factoryPack.cover}</p>
              <button className="mt-2 bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => copy(factoryPack.cover, "factoryCover")}>{copied === "factoryCover" ? "Copied!" : "Copy Cover Prompt"}</button>
            </div>

            <div className="bg-black p-3 rounded border border-gray-800">
              <h3 className="font-bold">3) PDF جاهز</h3>
              <p className="text-sm text-gray-300">{factoryPack.pdfStatus}</p>
              <p className="text-xs mt-2">استخدم Canva أو PowerPoint لترتيب الصور وتصدير PDF بحجم KDP.</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-bold">Book Listing Pack</h3>
            <p className="mt-2"><b>Title:</b> {factoryPack.title}</p>
            <p><b>Subtitle:</b> {factoryPack.subtitle}</p>
            <p className="mt-2"><b>Description:</b></p>
            <p className="text-sm whitespace-pre-line">{factoryPack.description}</p>
            <button className="mt-2 bg-gray-700 px-2 py-1 rounded text-xs" onClick={() => copy(`${factoryPack.title}\n\n${factoryPack.subtitle}\n\n${factoryPack.description}`, "factoryListing")}>{copied === "factoryListing" ? "Copied!" : "Copy Listing Pack"}</button>
          </div>
        </div>
      )}
    </div>
  );
}
