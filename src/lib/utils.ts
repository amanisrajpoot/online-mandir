import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import * as shortUUID from "short-uuid"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const translator = shortUUID.createTranslator ? shortUUID.createTranslator() : (shortUUID as any)()

export function encodeId(uuid: string): string {
  try {
    return translator.fromUUID(uuid)
  } catch (error) {
    // Fallback to original if not a valid UUID
    return uuid
  }
}

export function decodeId(shortId: string): string {
  try {
    // If it's already a full UUID format (36 chars), return as is
    if (shortId.length === 36 && shortId.includes('-')) return shortId
    return translator.toUUID(shortId)
  } catch (error) {
    // Fallback to original if decoding fails
    return shortId
  }
}
