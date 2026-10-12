import { Sparkles, ShieldCheck, Truck, RefreshCw, Award, Lock } from "lucide-react";

export default function TrustFeaturesStrip() {
  const features = [
    {
      icon: Award,
      title: "100% PURE SILK",
      description: "Premium quality guaranteed",
    },
    {
      icon: Sparkles,
      title: "HANDWOVEN",
      description: "By skilled weavers",
    },
    {
      icon: Lock,
      title: "SECURE PAYMENT",
      description: "100% secure checkout",
    },
    {
      icon: RefreshCw,
      title: "EASY RETURNS",
      description: "Hassle-free returns",
    },
    {
      icon: Truck,
      title: "FREE SHIPPING",
      description: "On orders above ₹1,000",
    },
  ];

  return (
    <section className="border-y border-[#E8E4DF] bg-[#FFF8F0] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-4">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-white border border-[#E8E4DF] shadow-xs transition hover:border-[#D4AF37]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF8F0] text-[#D4AF37] border border-[#D4AF37]/30">
                  <Icon size={22} className="stroke-[1.75]" />
                </div>
                <div className="min-w-0 text-left">
                  <h4 className="text-xs sm:text-sm font-bold tracking-wider text-[#2D2A26] uppercase">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-gray-500 leading-snug mt-0.5">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
