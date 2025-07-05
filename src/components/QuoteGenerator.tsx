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

export default function QuoteGenerator() {
  const [category, setCategory] = useState<string>('success')
  const [quote, setQuote] = useState<string>('')

  const getRandomQuote = (cat: string) => {
    const quotes = quotesData[cat]
    if (!quotes || quotes.length === 0) {
      setQuote('No quotes available for this category.')
      return
    }
    const randomIndex = Math.floor(Math.random() * quotes.length)
    setQuote(quotes[randomIndex])
  }

  useEffect(() => {
    getRandomQuote(category)
  }, [category])

  return (
    <div className="relative max-w-xl w-full px-8 py-12 rounded-xl bg-[#f8dfdc] text-center overflow-hidden shadow-md border border-[#eecbcb]
">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <svg viewBox="0 0 800 400" className="w-full h-full">
          <path d="M0 0C200 150 600 250 800 0V400H0V0Z" fill="#ebc9c4" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 items-center">
        <h2 className="text-2xl font-medium text-[#5a4c4c] font-serif">
          Quote Generator
        </h2>

        <motion.p
          key={quote}
          className="text-lg italic text-[#3f3f3f] max-w-md mt-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          "{quote}"
        </motion.p>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[220px] border-pink-300 bg-white">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(quotesData).map((key) => (
              <SelectItem key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={() => getRandomQuote(category)} // ✅ Fixed here
          className="bg-[#d97d7d] hover:bg-[#c76b6b] text-white font-medium rounded px-6 py-2"
        >
          Get New Quote
        </Button>
      </div>
    </div>
  )
}
