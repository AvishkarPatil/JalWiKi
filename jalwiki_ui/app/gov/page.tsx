"use client"

import { useState, useEffect } from 'react'
// Link and Image imports are not strictly necessary here if not used directly, but fine to keep
// import Link from 'next/link'
// import Image from 'next/image'
import { MagnifyingGlassIcon, NewspaperIcon, LightBulbIcon } from '@heroicons/react/24/outline' // Removed unused icons
import GovtNGOCard from '@/components/gov_ngo/govt-ngo-card'
import AnimatedSection from '@/components/gov_ngo/animated-section'
import PDFViewer from '@/components/gov_ngo/pdf-viewer'
import RelatedArticles from '@/components/gov_ngo/related-articles'
import WaterFactCard from '@/components/gov_ngo/water-fact-card'

interface SchemeData {
  id: number
  title: string
  description: string
  type: 'government' | 'ngo'
  pdfUrl: string
  contactEmail: string
  likes: number[] // This is an array of user IDs or similar
  imageUrl?: string
  audioUrl?: string
  youtubeUrl?: string
  isPopular?: boolean
}

interface Article {
  id: number
  title: string
  category: string
  slug: string
}

const sampleData: SchemeData[] = [
  {
    id: 1,
    title: 'National Water Mission',
    description: 'A comprehensive plan for water conservation, minimizing wastage and ensuring equitable distribution across the country.',
    type: 'government',
    pdfUrl: '/documents/national-water-mission.pdf',
    contactEmail: 'contact@nationalwatermission.gov.in',
    likes: [1, 2, 3],
    imageUrl: 'https://i.ibb.co/xx5GJfL/NJM.jpg',
    isPopular: true,
    audioUrl: '/audio/sample-audio.mp3',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  },
  {
    id: 2,
    title: 'Jal Shakti Abhiyan',
    description: 'A time-bound campaign with a mission-mode approach to improve water availability including ground water conditions in water-stressed blocks.',
    type: 'government',
    pdfUrl: '/documents/jal-shakti-abhiyan.pdf',
    contactEmail: 'jalshakti@gov.in',
    likes: [1],
    imageUrl: 'https://i.ibb.co/bR2SM6JC/JSA.jpg'
  },
  {
    id: 3,
    title: 'WaterAid India',
    description: 'Working to improve access to clean water, decent toilets and good hygiene for everyone, everywhere within a generation.',
    type: 'ngo',
    pdfUrl: '/documents/wateraid-india.pdf',
    contactEmail: 'waindia@wateraid.org',
    likes: [1,2,3,4,5],
    imageUrl: 'https://i.ibb.co/bMr2mmgM/WAid.jpg',
    isPopular: false,
    audioUrl: '/audio/wateraid.mp3'
  },
  {
    id: 4,
    title: 'Atal Bhujal Yojana',
    description: 'A Central Sector Scheme for sustainable management of ground water with community participation.',
    type: 'government',
    pdfUrl: '/documents/atal-bhujal-yojana.pdf',
    contactEmail: 'atalbhujal@gov.in',
    likes: [],
    imageUrl: 'https://i.ibb.co/7tWVKmky/AbhJal.jpg',
    isPopular: true
  },
  {
    id: 5,
    title: 'Water For People India',
    description: 'Working to develop high-quality drinking water and sanitation services, accessible to all, and sustained by strong communities.',
    type: 'ngo',
    pdfUrl: '/documents/water-for-people.pdf',
    contactEmail: 'india@waterforpeople.org',
    likes: [1,2],
    imageUrl: 'https://i.ibb.co/vvrT68LC/Wappl.jpg',
    youtubeUrl: 'https://www.youtube.com/watch?v=somevideo'
  },
  {
    id: 6,
    title: 'Namami Gange Programme',
    description: 'An Integrated Conservation Mission to accomplish the twin objectives of effective abatement of pollution and conservation and rejuvenation of River Ganga.',
    type: 'government',
    pdfUrl: '/documents/namami-gange.pdf',
    contactEmail: 'info@nmcg.nic.in',
    likes: [],
    imageUrl: 'https://i.ibb.co/99mc2Rz2/nmgg.jpg'
  }
];

const relatedArticlesData: Article[] = [
  { id: 1, title: 'Water Conservation Techniques for Farmers', category: 'Agriculture', slug: 'water-conservation-techniques-farmers' },
  { id: 2, title: 'Rainwater Harvesting: A Comprehensive Guide', category: 'Conservation', slug: 'rainwater-harvesting-guide' },
  { id: 3, title: 'India\'s Water Crisis: Challenges and Solutions', category: 'Policy', slug: 'india-water-crisis' },
  { id: 4, title: 'Groundwater Depletion in Rural Areas', category: 'Research', slug: 'groundwater-depletion-rural' },
  { id: 5, title: 'Community-Led Water Management Success Stories', category: 'Case Studies', slug: 'community-water-management' },
];

const waterFactsData = [
  "India has 18% of the world's population but only 4% of the world's freshwater resources.",
  "Groundwater provides 80% of India's domestic water supply in rural areas.",
  "The average annual per capita water availability in India has decreased significantly over the past decades.",
  "Over 600 million Indians face high to extreme water stress.",
  "By 2030, India's water demand is projected to be twice the available supply if current trends continue."
];

export default function GovtNGOPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState<SchemeData[]>(sampleData);
  const [filterType, setFilterType] = useState<'all' | 'government' | 'ngo'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = sampleData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(lowerSearchTerm) ||
                           item.description.toLowerCase().includes(lowerSearchTerm);
      if (filterType === 'all') return matchesSearch;
      return matchesSearch && item.type === filterType;
    });
    setFilteredData(filtered);
  }, [searchTerm, filterType]);

  // This function is not directly used by GovtNGOCard for its internal PDF button anymore
  // const handleOpenPdfFromCard = (item: SchemeData) => {
  //   setSelectedPdf({ url: item.pdfUrl, title: item.title });
  // };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-6 tracking-tight">
            Government & NGO Initiatives
          </h1>
          <div className="max-w-2xl mx-auto flex items-center gap-3 p-1.5 bg-white dark:bg-gray-800/50 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="relative flex-grow">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-500 dark:text-purple-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search schemes, initiatives..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-transparent rounded-full focus:outline-none text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base"
              />
            </div>
            <div className="flex space-x-1 flex-shrink-0 pr-1">
              {([
                { label: 'All', value: 'all' },
                { label: 'Govt', value: 'government' },
                { label: 'NGOs', value: 'ngo' }
              ] as const).map((typeOpt) => (
                <button
                  key={typeOpt.value}
                  onClick={() => setFilterType(typeOpt.value)}
                  className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 focus:ring-purple-500
                    ${filterType === typeOpt.value
                      ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100 dark:bg-gray-700 dark:text-purple-300 dark:hover:bg-gray-600'
                    }`}
                >
                  {typeOpt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3 xl:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="h-48 bg-purple-200 dark:bg-purple-700/30"></div>
                    <div className="p-5">
                      <div className="h-5 bg-purple-200 dark:bg-purple-700/50 rounded w-1/3 mb-3"></div>
                      <div className="h-7 bg-purple-200 dark:bg-purple-700/50 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6 mb-3"></div>
                      <div className="h-8 bg-purple-200 dark:bg-purple-700/50 rounded w-1/4"></div>
                    </div>
                  </div>
                ))
              ) : filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <AnimatedSection key={item.id} delay={index * 100}>
                    {/* No @ts-ignore needed if GovtNGOCard.tsx is correctly typed */}
                    <GovtNGOCard
                      id={item.id}
                      title={item.title}
                      description={item.description}
                      type={item.type}
                      pdfUrl={item.pdfUrl}
                      contactEmail={item.contactEmail}
                      likes={item.likes.length} // Pass the count of likes
                      imageUrl={item.imageUrl}
                      audioUrl={item.audioUrl}
                      youtubeUrl={item.youtubeUrl}
                      isPopular={item.isPopular}
                    />
                  </AnimatedSection>
                ))
              ) : (
                <div className="md:col-span-2 text-center py-16 bg-white dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                  <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-purple-400 dark:text-purple-500 opacity-70" />
                  <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">No Results Found</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">We couldn't find any schemes or initiatives matching your search.</p>
                  <div className="mt-8">
                    <button
                      onClick={() => { setSearchTerm(''); setFilterType('all'); }}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    >
                      Clear Search & Filters
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:w-1/3 xl:w-1/4 space-y-8 sticky top-8 self-start">
            <AnimatedSection delay={100}>
              <div className="bg-white dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <NewspaperIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                    Related Articles
                  </h3>
                </div>
                <RelatedArticles articles={relatedArticlesData} />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200}>
              <div className="bg-white dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-xl p-5 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center mb-4">
                  <LightBulbIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
                  <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                    Water Facts
                  </h3>
                </div>
                <div className="max-h-80 overflow-y-auto pr-1 pl-4 space-y-3 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100 dark:scrollbar-thumb-purple-600 dark:scrollbar-track-gray-700 rounded-md">
                  {waterFactsData.map((fact, index) => (
                    <WaterFactCard key={`water-${index}`} fact={fact} />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </aside>
        </div>
      </main>

      {selectedPdf && (
        <PDFViewer
          pdfUrl={selectedPdf.url}
          title={selectedPdf.title}
          onClose={() => setSelectedPdf(null)}
        />
      )}
    </div>
  )
}