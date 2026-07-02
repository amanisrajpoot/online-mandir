"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { encodeId } from "@/lib/utils"

export function ChadhavaCard({ item, index = 0 }: { item: any, index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/chadhava/${encodeId(item.id)}`} className="block">
        <Card className="overflow-hidden h-full group border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-400)] transition-all hover:shadow-[0_0_15px_rgba(251,146,60,0.15)] bg-[var(--color-mandir-surface)]">
          <div className="relative h-32 sm:h-40 overflow-hidden">
            <Image 
              src={item.image_url || "/images/chadhava_pushp.png"} 
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute bottom-2 left-2 right-2">
              <div className="text-[10px] sm:text-xs font-medium text-[var(--color-saffron-600)] truncate bg-[var(--color-mandir-card)]/80 px-2 py-1 rounded backdrop-blur-md border border-[var(--color-mandir-border)] inline-flex items-center">
                <MapPin className="w-3 h-3 mr-1 shrink-0" />
                {item.temples?.name}
              </div>
            </div>
          </div>
          
          <CardContent className="p-3 sm:p-4">
            <h3 className="text-sm sm:text-base font-bold font-[var(--font-heading)] leading-tight mb-1 group-hover:text-[var(--color-saffron-400)] transition-colors line-clamp-1">
              {item.title}
            </h3>
            
            <p className="text-xs text-[var(--color-mandir-text-muted)] line-clamp-2 mb-3 h-8">
              {item.description}
            </p>
            
            <div className="flex items-center justify-between border-t border-[var(--color-mandir-border)] pt-2">
              <span className="text-base sm:text-lg font-bold text-[var(--color-mandir-text)]">₹{item.price}</span>
              <span className="text-xs uppercase font-bold text-[var(--color-saffron-500)] tracking-wider">Offer</span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
