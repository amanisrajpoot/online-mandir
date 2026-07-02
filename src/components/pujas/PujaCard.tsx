"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { StarRating } from "@/components/ui/StarRating"
import { encodeId } from "@/lib/utils"

export function PujaCard({ puja, index = 0 }: { puja: any, index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="overflow-hidden h-full flex flex-col group border-[var(--color-mandir-border)] hover:border-[var(--color-saffron-500)]/50 transition-colors bg-[var(--color-mandir-surface)]">
        <Link href={`/pujas/${encodeId(puja.id)}`} className="flex-1 flex flex-col">
          <div className="relative h-48 overflow-hidden bg-[var(--color-mandir-bg)]">
            <Image 
              src={puja.image_url || "/images/puja_ganesh.png"} 
              alt={puja.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-3 left-3 flex gap-2">
              <Badge variant="secondary" className="bg-black/60 backdrop-blur-md border-white/10 text-white">
                {puja.category}
              </Badge>
            </div>
          </div>
          
          <CardContent className="p-5 flex-1 flex flex-col">
            <div className="mb-2 flex items-center text-xs font-medium text-[var(--color-saffron-500)]">
              <MapPin className="mr-1 h-3 w-3" />
              {puja.temples?.name}, {puja.temples?.location}
            </div>
            
            <h3 className="mb-1 text-lg font-bold font-[var(--font-heading)] leading-tight group-hover:text-[var(--color-saffron-500)] transition-colors">
              {puja.title}
            </h3>
            
            <div className="mb-2">
              <StarRating rating={4.9} totalReviews={87} showText size={14} />
            </div>
            
            <p className="mb-4 text-sm text-[var(--color-mandir-text-muted)] line-clamp-2 flex-1">
              {puja.problem_statement}
            </p>
          </CardContent>
        </Link>
        
        <div className="px-5 pb-5 mt-auto border-t border-[var(--color-mandir-border)] pt-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-[var(--color-mandir-text-muted)] line-through">
              ₹{puja.base_price}
            </div>
            <div className="text-lg font-bold text-[var(--color-mandir-text)]">
              ₹{puja.sale_price}
            </div>
          </div>
          
          <Link href={`/pujas/${encodeId(puja.id)}/book`}>
            <Button variant="gradient" className="rounded-full px-6">
              Book
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}
