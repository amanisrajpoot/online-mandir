"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { Sun, Moon, Sunrise, Sunset } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

import { calculatePanchang } from "@/lib/astrology/panchang"

export function PanchangWidget() {
  const [data, setData] = React.useState<any>(null)
  const today = new Date()

  React.useEffect(() => {
    // Try to get user location, otherwise default to New Delhi
    if (typeof window !== "undefined" && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const panchang = calculatePanchang(today, position.coords.latitude, position.coords.longitude)
          setData(panchang)
        },
        (error) => {
          // Silently fall back to default coordinates without loud console errors in production
          if (process.env.NODE_ENV !== "production") {
            console.info("Using default coordinates for Panchang (location not granted).");
          }
          setData(calculatePanchang(today))
        }
      )
    } else {
      setData(calculatePanchang(today))
    }
  }, [])

  if (!data) return null

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-2xl font-bold font-[var(--font-heading)] text-[var(--color-mandir-text)] mb-6">
          Today's Panchang
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="h-full bg-gradient-to-br from-[var(--color-mandir-surface)] to-[#2a1b38] border-[#4a326b] shadow-[0_0_20px_rgba(124,58,237,0.1)]">
              <CardHeader className="pb-2 border-b border-white/5">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-[var(--color-saffron-300)]">{format(today, "EEEE")}</span>
                  <span className="text-sm font-normal text-[var(--color-mandir-text-muted)]">{format(today, "dd MMM yyyy")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-[var(--color-mandir-text-muted)]">Tithi</span>
                  <span className="font-medium text-[var(--color-mandir-text)]">{data.tithi}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-[var(--color-mandir-text-muted)]">Nakshatra</span>
                  <span className="font-medium text-[var(--color-mandir-text)]">{data.nakshatra}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-sm text-[var(--color-mandir-text-muted)]">Yoga</span>
                  <span className="font-medium text-[var(--color-mandir-text)]">{data.yoga}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-[var(--color-mandir-text-muted)]">Karana</span>
                  <span className="font-medium text-[var(--color-mandir-text)]">{data.karana}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <Card className="bg-[var(--color-mandir-surface)]/80 backdrop-blur-sm border-[var(--color-mandir-border)]">
              <CardContent className="p-4 sm:p-6 flex items-center h-full">
                <div className="rounded-full bg-orange-500/10 p-4 mr-4 border border-orange-500/20">
                  <Sun className="h-8 w-8 text-orange-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[var(--color-mandir-text-muted)] mb-3">Sun Details</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <div className="flex items-center text-xs text-[var(--color-mandir-text-muted)] mb-1">
                        <Sunrise className="h-3 w-3 mr-1" /> Sunrise
                      </div>
                      <div className="font-medium">{data.sunrise}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-xs text-[var(--color-mandir-text-muted)] mb-1">
                        <Sunset className="h-3 w-3 mr-1" /> Sunset
                      </div>
                      <div className="font-medium">{data.sunset}</div>
                    </div>
                    <div className="col-span-2 mt-1 pt-2 border-t border-white/5">
                      <span className="text-xs text-[var(--color-mandir-text-muted)]">Sign:</span> <span className="text-sm font-medium">{data.sunSign}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[var(--color-mandir-surface)]/80 backdrop-blur-sm border-[var(--color-mandir-border)]">
              <CardContent className="p-4 sm:p-6 flex items-center h-full">
                <div className="rounded-full bg-blue-500/10 p-4 mr-4 border border-blue-500/20">
                  <Moon className="h-8 w-8 text-blue-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-[var(--color-mandir-text-muted)] mb-3">Moon Details</h3>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <div className="flex items-center text-xs text-[var(--color-mandir-text-muted)] mb-1">
                        <Sunrise className="h-3 w-3 mr-1" /> Moonrise
                      </div>
                      <div className="font-medium">{data.moonrise}</div>
                    </div>
                    <div>
                      <div className="flex items-center text-xs text-[var(--color-mandir-text-muted)] mb-1">
                        <Sunset className="h-3 w-3 mr-1" /> Moonset
                      </div>
                      <div className="font-medium">{data.moonset}</div>
                    </div>
                    <div className="col-span-2 mt-1 pt-2 border-t border-white/5">
                      <span className="text-xs text-[var(--color-mandir-text-muted)]">Sign:</span> <span className="text-sm font-medium">{data.moonSign}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="sm:col-span-2 bg-[var(--color-mandir-surface)]/80 backdrop-blur-sm border-[var(--color-mandir-border)]">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-[var(--color-sacred-red)] font-medium mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sacred-red)] mr-1.5"></span>
                      Rahu Kalam
                    </div>
                    <div className="text-sm font-medium">{data.rahuKalam}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--color-saffron-500)] font-medium mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-saffron-500)] mr-1.5"></span>
                      Yamaganda
                    </div>
                    <div className="text-sm font-medium">{data.yamaganda}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--color-temple-gold)] font-medium mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-temple-gold)] mr-1.5"></span>
                      Gulika
                    </div>
                    <div className="text-sm font-medium">{data.gulika}</div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--color-auspicious-green)] font-medium mb-1 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-auspicious-green)] mr-1.5"></span>
                      Auspicious Time
                    </div>
                    <div className="text-sm font-medium">{data.auspicious}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
