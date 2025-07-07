'use client'

import { useEffect, useState } from 'react'
import { quotesData } from '@/lib/quotes'
import { motion } from 'framer-motion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Quote, Star, Share2 } from 'lucide-react'
import { useTheme } from 'next-themes'

type QuoteItem = {
  quote: string
  author: string
}

export default function QuoteGenerator() {
  const [category, setCategory] = useState<string>('')
  const [categories, setCategories] = useState<string[]>([])
  const [currentQuote, setCurrentQuote] = useState<QuoteItem | null>(null)

  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const keys = Object.keys(quotesData)
    setCategories(keys)

    if (keys.length > 0) {
      setCategory(keys[0])
    }
  }, [])

  useEffect(() => {
    if (category) {
      getRandomQuote(category)
    }
  }, [category])

  const getRandomQuote = (cat: string) => {
    const quoteList = quotesData[cat]
    if (!quoteList || quoteList.length === 0) {
      setCurrentQuote({ quote: 'No quotes available in this category.', author: '' })
      return
    }
    const index = Math.floor(Math.random() * quoteList.length)
    setCurrentQuote(quoteList[index])
  }

  const handleFavorite = () => {
    if (!currentQuote) return
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]')
    const updated = [...saved, currentQuote]
    localStorage.setItem('favorites', JSON.stringify(updated))
    
  }

  const handleShare = () => {
    if (!currentQuote) return
    const text = `"${currentQuote.quote}" — ${currentQuote.author}`
    navigator.clipboard.writeText(text)
    alert('Quote copied to clipboard!')
  }

  return (
    <div className="relative max-w-xl w-full px-8 py-12 rounded-xl bg-background text-center overflow-hidden shadow-md border border-[#eecbcb] dark:border-zinc-700">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <path d="M0 0C200 150 600 250 800 0V400H0V0Z" fill="#ebc9c4" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 items-center">
        {/* Header */}
        <div className="flex items-center justify-between w-full max-w-md">
          <h2 className="text-2xl font-medium text-[#5a4c4c] font-serif dark:text-zinc-200">
            Quote Generator
          </h2>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded border border-zinc-300 dark:border-zinc-600"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Category dropdown */}
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[220px] border-pink-300 bg-white dark:bg-zinc-800 dark:text-white mt-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((key) => (
              <SelectItem key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* New Quote Button */}
        <Button
          onClick={() => getRandomQuote(category)}
          className="bg-[#d97d7d] hover:bg-[#c76b6b] text-white font-medium rounded px-6 py-2 mt-1"
        >
          New Quote
        </Button>

        {/* Quote display */}
        {currentQuote && (
          <motion.div
            key={currentQuote.quote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 shadow-md rounded p-4 italic border-l-4 border-pink-400 text-left text-zinc-700 dark:text-zinc-300 mt-4 max-w-md"
          >
            <div className="flex items-start gap-3">
              <Quote size={16} className="text-pink-500 mt-1" />
              <div className="flex-1">
              <p>&ldquo;{currentQuote.quote}&rdquo;</p>  
                <p className="text-sm mt-2 text-right text-gray-500">— {currentQuote.author}</p>
              </div>
              <div className="flex flex-col gap-2 ml-2">
                <button onClick={handleFavorite} title="Favorite">
                  <Star size={18} className="text-yellow-400 hover:scale-110" />
                </button>
                <button onClick={handleShare} title="Share">
                  <Share2 size={18} className="text-blue-400 hover:scale-110" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
