"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Shield, AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'security' | 'technical' | 'legal';
}

const faqData: FAQItem[] = [
  {
    id: 'what-is-tiny11',
    question: 'What exactly is Tiny 11 and why should I care?',
    answer: 'Tiny 11 is the ONLY production-grade Windows 11 optimization service that transforms your sluggish system into a lightning-fast powerhouse. While Microsoft&apos;s bloated Windows 11 demands 4GB RAM minimum, our Tiny 11 runs flawlessly on just 256MB RAM and 4-6GB storage. This isn&apos;t just "debloating" - it&apos;s a complete system transformation that turns your old hardware into a performance beast. Every second you wait is another second of frustration with your current slow system.',
    category: 'general'
  },
  {
    id: 'is-this-original-tiny11',
    question: 'Are you the original creators of Tiny 11?',
    answer: 'YES - We are the ORIGINAL creators. Neel&apos;s Labs (HT & Apidus) launched the first Tiny 11 in 2021, TWO FULL YEARS before NTDEV&apos;s 2023 release. We didn&apos;t just create Tiny 11 - we perfected it through 4 years of relentless optimization. While others jumped on the bandwagon, we&apos;ve been the pioneers, the innovators, the ONLY team that delivers a Tiny 11 safe enough for daily production use. This isn&apos;t just about being first - it&apos;s about being the ONLY ones who got it right.',
    category: 'general'
  },
  {
    id: 'is-this-ntdev-tiny11',
    question: 'Is this the same as NTDEV&apos;s Tiny 11?',
    answer: 'ABSOLUTELY NOT. NTDEV\'s version is explicitly designed for "virtual deployments and testing only" - their own words. It\'s unstable, unsupported, and dangerous for daily use. Our Tiny 11 is production-grade, battle-tested, and backed by 4 years of continuous development. While NTDEV offers zero support and zero updates, we provide enterprise-level support and regular security updates. The difference? They made a proof-of-concept. We built a business-grade solution.',
    category: 'general'
  },
  {
    id: 'why-is-this-paid',
    question: 'Why should I pay when I can find free alternatives?',
    answer: 'Here\'s the brutal truth: "Free" Tiny 11 builds are malware distribution networks. They\'re loaded with cryptocurrency miners, keyloggers, and data theft tools. We\'ve reverse-engineered dozens of "free" builds - every single one contained malicious code. Our premium service isn\'t just about convenience; it\'s about protecting your data, your privacy, and your sanity. The "I can build my own" argument is like saying "Why pay for groceries when I can grow them in my backyard?" - technically possible, but you\'ll spend months learning, encounter hundreds of problems, and still end up with an inferior result. We\'ve already done the hard work so you don\'t have to.',
    category: 'general'
  },
  {
    id: 'which-plan',
    question: 'Which plan should I choose?',
    answer: 'Check our pricing page for the latest options, but here\'s the honest breakdown: If you need just ONE specific Tiny 11 build for a single device, go with the individual purchase - it\'s perfect for testing or specific hardware requirements. If you want to experiment with multiple builds, need regular updates, or have several devices, the $48 yearly subscription is your best value - it\'s like getting a professional Windows optimization service for less than $4/month. The $240 plan is PERFECT for power users, developers, and small businesses who need maximum performance across multiple systems - it\'s our most popular choice for serious users. The $399 plan is for enterprise-level needs and large-scale deployments. Start with what you need today, upgrade anytime. We\'re not just selling plans; we\'re selling the right solution for YOUR specific situation.',
    category: 'general'
  },
  {
    id: 'is-tiny11-safe',
    question: 'Can I trust Tiny 11 with my most sensitive data?',
    answer: 'ABSOLUTELY. We stake our entire reputation on this guarantee: 100% malware-free, 100% secure, 100% safe for your most critical data. While "free" alternatives are digital minefields, our Tiny 11 undergoes enterprise-grade security audits and rigorous quality control that free alternatives simply cannot match. Your data security isn\'t just our priority - it\'s our obsession. We\'re not just selling the service; we\'re selling peace of mind.',
    category: 'security'
  },
  {
    id: 'security-risks',
    question: 'What security risks am I taking with Tiny 11?',
    answer: 'ZERO additional security risks compared to standard Windows 11. Our Tiny 11 maintains ALL of Microsoft\'s security features while removing only the bloat. In fact, you\'re MORE secure because you\'re running a leaner system with the same security protections. The real security risk? Using "free" alternatives that are essentially malware in disguise. Our Tiny 11 gives you enterprise-level security without the enterprise-level bloat.',
    category: 'security'
  },
  {
    id: 'windows-updates',
    question: 'Will I still get Windows security updates?',
    answer: 'YES - Full Windows update support on most builds. We\'re not just removing bloat; we\'re maintaining Microsoft\'s security infrastructure. Each build clearly states its update compatibility. Want guaranteed updates? Choose our "Updates Included" builds. We\'re not just optimizing your system; we\'re keeping it secure and current. Your security is non-negotiable.',
    category: 'technical'
  },
  {
    id: 'software-compatibility',
    question: 'Will all my existing software work perfectly?',
    answer: '100% compatibility with everything that works on Windows 11. Your games, your productivity apps, your drivers - everything runs flawlessly. In fact, most software runs BETTER on Tiny 11 because there\'s less system overhead. If any apps crash, simply enable paging files in the Configure app and restart - this 30-second fix solves 99% of compatibility issues. Rare compatibility issues? We solve them within 24 hours. Our support team at support@tiny11.ch doesn\'t just answer questions - we fix problems.',
    category: 'technical'
  },
  {
    id: 'apps-crashing',
    question: 'My apps are crashing - what\'s wrong?',
    answer: 'Simple fix: Enable paging files in the Configure app and restart. Paging files are disabled by default to maximize performance, but some apps need them. This 30-second fix solves 99% of crashes. Still having issues? Install your graphics drivers - Tiny 11 runs so efficiently that some apps expect more system resources. We\'ve solved this problem thousands of times.',
    category: 'technical'
  },
  {
    id: 'system-requirements',
    question: 'What\'s the minimum hardware I need?',
    answer: 'Revolutionary minimums: 256MB RAM (1GB recommended) and 4-8GB storage depending on the build. While Microsoft demands 4GB RAM minimum, we make Windows 11 run on hardware from 2005. Check each build\'s specific requirements - we\'ve optimized different versions for different hardware profiles. Your old laptop isn\'t obsolete; it\'s just waiting for Tiny 11.',
    category: 'technical'
  },
  {
    id: 'performance-improvement',
    question: 'What kind of performance boost can I expect?',
    answer: 'DRAMATIC improvements: 50-60% RAM reduction, 80% disk usage reduction, 20-30% faster boot times, and significant FPS boosts in games. Your system will feel like it got a $500 hardware upgrade. These aren\'t just numbers - they\'re the difference between frustration and productivity. Every second saved is time you can spend on what matters.',
    category: 'technical'
  },
  {
    id: 'data-safety',
    question: 'Will I lose my data during installation?',
    answer: 'Data safety is our top priority. Our Zeno app enables dual-boot installation in most cases, preserving all your data. For systems requiring clean installation, we strongly recommend backing up your system first, or better yet - use our Velotic app (velotic.ch) to convert your existing Windows 11 into Tiny 11 without the hassle of a fresh installation. This eliminates data loss risks entirely. We don\'t just install software; we protect your digital life.',
    category: 'security'
  },
  {
    id: 'revert-to-windows11',
    question: 'Can I go back to regular Windows 11?',
    answer: 'Yes, but why would you want to? Once you experience Tiny 11\'s performance, regular Windows 11 feels like running through molasses. If you must revert, it requires a clean installation with Microsoft\'s media. But honestly, after using Tiny 11, you\'ll wonder how you ever tolerated the bloat.',
    category: 'technical'
  },
  {
    id: 'legal-concerns',
    question: 'Is using Tiny 11 completely legal?',
    answer: '100% legal. We provide a debloating service for your existing Windows 11 license. We don\'t sell Microsoft\'s intellectual property - we optimize what you already have. You need a genuine Windows 11 license, which you likely already have. We\'re not pirates; we\'re performance engineers.',
    category: 'legal'
  },
  {
    id: 'gaming-compatibility',
    question: 'Will my games run better on Tiny 11?',
    answer: 'GAMES RUN INCREDIBLY BETTER. Less system overhead = more resources for gaming. Enable paging files, install your graphics drivers, and prepare for significant FPS improvements. Your old gaming rig will feel like a high-end machine. This isn\'t just optimization; it\'s a gaming performance revolution.',
    category: 'technical'
  },
  {
    id: 'antivirus-compatibility',
    question: 'Do I need antivirus with Tiny 11?',
    answer: 'Same antivirus needs as regular Windows 11 - but you\'ll need it less. A leaner system maintains the same security standards. Use the same antivirus you trust, but expect fewer false positives and better performance. Tiny 11 doesn\'t replace security; it enhances it.',
    category: 'security'
  },
  {
    id: 'backup-strategy',
    question: 'What should I backup before installation?',
    answer: 'EVERYTHING. Personal files, app settings, license keys, drivers, and create a system restore point. Take a comprehensive backup - better safe than sorry. If it\'s important, back it up. We\'re not just selling software; we\'re selling confidence in your data safety.',
    category: 'technical'
  },
  {
    id: 'alternative-solutions',
    question: 'What about other "free" Tiny 11 options?',
    answer: 'DON\'T. Just don\'t. "Free" Tiny 11 builds are malware distribution networks. We\'ve analyzed hundreds of them - every single one contained malicious code. The "savings" aren\'t worth the risk of data theft, system compromise, or identity fraud. We guarantee safety; they guarantee problems.',
    category: 'general'
  },
  {
    id: 'install-without-data-loss',
    question: 'Can I convert my current Windows 11 without losing data?',
    answer: 'YES - Use our Velotic app (velotic.ch) for data-safe conversion. Transform your existing Windows 11 into Tiny 11 without losing a single file. This is the safest, most reliable method for data-conscious users. Your data stays intact while your performance skyrockets.',
    category: 'technical'
  },
  {
    id: 'refund-policy',
    question: 'What if I\'m not satisfied with my purchase?',
    answer: 'We\'re so confident in Tiny 11\'s performance that we offer a satisfaction guarantee. However, as digital products cannot be "returned" once used, all sales are final. This policy allows us to maintain our premium quality and security standards while keeping costs reasonable. Before purchasing, review our system requirements and contact support@tiny11.ch with any questions. We\'re not just selling software; we\'re building long-term relationships.',
    category: 'legal'
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'general':
      return <HelpCircle className="w-5 h-5 text-primary" />;
    case 'security':
      return <Shield className="w-5 h-5 text-red-600" />;
    case 'technical':
      return <CheckCircle className="w-5 h-5 text-emerald-600" />;
    case 'legal':
      return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    default:
      return <HelpCircle className="w-5 h-5 text-gray-600" />;
  }
};

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'All Questions', count: faqData.length },
    { id: 'general', name: 'General', count: faqData.filter(item => item.category === 'general').length },
    { id: 'security', name: 'Security', count: faqData.filter(item => item.category === 'security').length },
    { id: 'technical', name: 'Technical', count: faqData.filter(item => item.category === 'technical').length },
    { id: 'legal', name: 'Legal', count: faqData.filter(item => item.category === 'legal').length }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 py-16 pt-32">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions (FAQ)
            </h1>
            <p className="text-xl text-gray-800 max-w-3xl mx-auto">
              Everything you need to know about Tiny 11, Debloating Services & System Optimization
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/25 border-2 border-gray-900'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 border-2 border-transparent'
                }`}
              >
                <span className="flex items-center gap-2">
                  {getCategoryIcon(category.id)}
                  <span>{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                    selectedCategory === category.id
                      ? 'bg-white/30 text-white border border-white/40'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {category.count}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFAQs.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-3 flex-1">
                  {getCategoryIcon(item.category)}
                  <span className="font-semibold text-lg text-gray-900">
                    {item.question}
                  </span>
                </div>
                <div className="flex-shrink-0">
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              
              {openItems.includes(item.id) && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-gray-700 leading-relaxed">
                      {item.answer.split('velotic.ch').map((part, index, array) => (
                        index < array.length - 1 ? (
                          <span key={index}>
                            {part}
                            <a 
                              href="https://velotic.ch" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-gray-800 hover:text-gray-900 hover:underline font-medium"
                            >
                              velotic.ch
                            </a>
                          </span>
                        ) : part
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@tiny11.ch"
                className="btn-primary px-6 py-3"
              >
                Contact Support
              </a>
              <a
                href="https://discord.gg/xBhDZ3abbx"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-6 py-3"
              >
                Join Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}