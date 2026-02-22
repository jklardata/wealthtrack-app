import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Creatives | SoloFI",
  description: "Marketing creatives for Solofi.",
};

const creatives = [
  {
    title: "Own Your Tax Strategy",
    slug: "own-your-tax-strategy",
    video: "/creative/Own_your_tax_strategy_version_1.mp4",
    poster: "/creative/Own_your_tax_strategy_version_1.png",
  },
  {
    title: "Secure Your 2025 Return",
    slug: "secure-your-2025-return",
    video: "/creative/Secure_your_2025_return_version_1.mp4",
    poster: "/creative/Secure_your_2025_return_version_1.png",
  },
  {
    title: "Compare Every Scenario",
    slug: "compare-every-scenario",
    image: "/creative/Compare_every_scenario_version_1.png",
  },
  {
    title: "Maximize Your Savings",
    slug: "maximize-your-savings",
    image: "/creative/Maximize_your_savings_version_1.png",
  },
];

export default function CreativePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 mb-4">Creatives</h1>
        <p className="text-slate-500 mb-14 text-lg">Solofi ad creatives — v1</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {creatives.map((item) => (
            <div
              key={item.slug}
              className="bg-white border-2 border-black rounded-2xl overflow-hidden"
            >
              {item.video ? (
                <video
                  src={item.video}
                  poster={item.poster}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full object-cover"
                />
              ) : (
                <Image
                  src={item.image!}
                  alt={item.title}
                  width={800}
                  height={800}
                  className="w-full object-cover"
                />
              )}
              <div className="px-5 py-4 border-t-2 border-black">
                <p className="font-black text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-500 mt-0.5">
                  {item.video ? "Video • v1" : "Image • v1"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
