// import { useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import { HugeiconsIcon } from "@hugeicons/react";
// import { SmartPhone01Icon, LaptopIcon } from "@hugeicons/core-free-icons";
// import { PRICING_PLANS, FEATURE_EXPLANATIONS } from "@/lib/constants";
// import { PricingPlanCard } from "@/components/pricing/PricingPlanCard";
// import { PricingPlanToggle } from "@/components/pricing/PricingPlanToggle";
// import { FeatureExplanation } from "@/components/pricing/FeatureExplanation";
// import { Card, CardContent } from "@/components/ui/card";

// const Pricing = () => {
//     const [isMonthly, setIsMonthly] = useState(false);

//     return (
//         <div className="min-h-screen bg-background pb-28">
//             <header className="relative pt-24 pb-16 px-6 text-center">
//                 <div className="max-w-3xl mx-auto space-y-6">
//                     <motion.h1
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="text-4xl sm:text-6xl font-black tracking-tighter"
//                     >
//                         Experience{" "}
//                         <span className="text-primary italic">
//                             Aetherscape premium.
//                         </span>
//                     </motion.h1>
//                     <motion.p
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: 0.1 }}
//                         className="text-lg text-muted-foreground max-w-xl mx-auto"
//                     >
//                         Automate your ambient environment, generate unlimited
//                         mixes with AI, and sync across all your devices.
//                     </motion.p>
//                 </div>

//                 <div className="mt-12 flex flex-col items-center">
//                     <PricingPlanToggle
//                         isMonthly={isMonthly}
//                         onChange={setIsMonthly}
//                     />

//                     <AnimatePresence>
//                         {isMonthly && (
//                             <motion.p
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -10 }}
//                                 className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest -mt-4 mb-4"
//                             >
//                                 Tip: Pay annually and get 2 months free!
//                             </motion.p>
//                         )}
//                     </AnimatePresence>
//                 </div>
//             </header>

//             <section className="px-6">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 max-w-6xl mx-auto">
//                     {PRICING_PLANS.map((plan) => (
//                         <PricingPlanCard
//                             key={plan.id}
//                             plan={plan}
//                             isMonthly={isMonthly}
//                         />
//                     ))}
//                 </div>
//             </section>

//             <FeatureExplanation features={FEATURE_EXPLANATIONS} />

//             <section className="mt-32 px-6">
//                 <Card className="max-w-5xl mx-auto bg-primary text-primary-foreground overflow-hidden border-none shadow-xl">
//                     <CardContent className="p-12 text-center space-y-8">
//                         <div className="flex justify-center gap-6">
//                             <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
//                                 <HugeiconsIcon
//                                     icon={SmartPhone01Icon}
//                                     className="size-8"
//                                 />
//                             </div>
//                             <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
//                                 <HugeiconsIcon
//                                     icon={LaptopIcon}
//                                     className="size-8"
//                                 />
//                             </div>
//                         </div>
//                         <div className="space-y-4">
//                             <h2 className="text-3xl font-black tracking-tight">
//                                 One account, all your devices.
//                             </h2>
//                             <p className="text-base opacity-90 max-w-md mx-auto font-medium">
//                                 Your presets, library, and settings stay
//                                 perfectly in sync between your phone and your
//                                 computer. Log in anywhere and get instantly back
//                                 into your flow.
//                             </p>
//                         </div>
//                     </CardContent>
//                 </Card>
//             </section>

//             <footer className="mt-20 text-center px-6">
//                 <p className="text-xs font-bold text-muted-foreground max-w-xs mx-auto opacity-50">
//                     Monthly and yearly options. All prices in USD. Subscription
//                     auto-renews. Cancel anytime.
//                 </p>
//             </footer>
//         </div>
//     );
// };

// export default Pricing;
import React from "react";

const Pricing = () => {
    return <div>Pricing</div>;
};

export default Pricing;
