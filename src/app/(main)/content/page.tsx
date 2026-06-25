import { Metadata } from 'next'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { ArrowRight, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Spiritual Content Hub | Vandanam',
  description: 'Read articles, guides, and spiritual content about Sanatana Dharma, rituals, and prominent temples across India.',
}

const articles = [
  {
    id: 'significance-of-rudrabhishek',
    title: 'The Spiritual Significance of Rudrabhishek Puja',
    description: 'Learn about the immense spiritual benefits and the correct procedure of performing Rudrabhishek Puja for Lord Shiva.',
    date: 'March 1, 2024',
    readTime: '4 min read'
  },
  {
    id: 'kashi-vishwanath-history',
    title: 'The History and Significance of Kashi Vishwanath Temple',
    description: 'Explore the rich history, spiritual significance, and the mystical energy of the Kashi Vishwanath Temple in Varanasi.',
    date: 'March 5, 2024',
    readTime: '5 min read'
  },
  {
    id: 'types-of-chadhava',
    title: 'Understanding the Different Types of Chadhava Offerings',
    description: 'Learn about the spiritual meaning behind different types of Chadhava like Pushp, Vastra, Bhog, and Deep Daan offered in Hindu temples.',
    date: 'March 10, 2024',
    readTime: '3 min read'
  },
  {
    id: 'preparing-for-online-puja',
    title: 'How to Prepare for an Online Puja at Home',
    description: 'A step-by-step guide on how to prepare yourself and your home to receive the maximum spiritual benefits from an online temple puja.',
    date: 'March 12, 2024',
    readTime: '3 min read'
  },
  {
    id: '12-jyotirlingas-guide',
    title: 'The 12 Jyotirlingas: A Spiritual Journey',
    description: 'A comprehensive guide to the 12 sacred Jyotirlingas of Lord Shiva spread across India, their locations, and mythological significance.',
    date: 'March 15, 2024',
    readTime: '6 min read'
  },
  {
    id: 'mahakaleshwar-bhasma-aarti',
    title: 'Why We Offer Bhasma at Mahakaleshwar',
    description: 'Understand the profound meaning behind the famous Bhasma Aarti at Ujjain Mahakaleshwar and the significance of offering sacred ash to Lord Shiva.',
    date: 'March 20, 2024',
    readTime: '4 min read'
  },
  {
    id: 'navratri-9-forms-durga',
    title: 'Navratri Special: Worshipping the 9 Forms of Maa Durga',
    description: 'A spiritual guide to the nine nights of Navratri, exploring the significance of the Navadurga and how to seek their blessings.',
    date: 'March 25, 2024',
    readTime: '5 min read'
  }
]

export default function ContentPage() {
  return (
    <div className="container mx-auto px-4 py-12 pb-24 max-w-5xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-4">
          Spiritual Content Hub
        </h1>
        <p className="text-lg text-[var(--color-mandir-text-muted)] max-w-2xl mx-auto">
          Deepen your spiritual journey with our collection of articles, guides, and stories from ancient scriptures.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link key={article.id} href={`/content/${article.id}`}>
            <Card className="h-full group hover:border-[var(--color-saffron-500)] transition-colors bg-[var(--color-mandir-surface)] overflow-hidden">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center text-xs text-[var(--color-saffron-500)] font-medium mb-3">
                  <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                  Article
                </div>
                
                <h2 className="text-xl font-bold font-[var(--font-heading)] mb-3 group-hover:text-[var(--color-saffron-500)] transition-colors">
                  {article.title}
                </h2>
                
                <p className="text-[var(--color-mandir-text-muted)] text-sm line-clamp-3 mb-6 flex-grow">
                  {article.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-[var(--color-mandir-text-muted)] mt-auto pt-4 border-t border-[var(--color-mandir-border)]">
                  <span>{article.date}</span>
                  <span className="flex items-center font-medium group-hover:text-[var(--color-saffron-500)]">
                    Read Article <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
