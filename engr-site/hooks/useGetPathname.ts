"use client"
import { usePathname } from 'next/navigation';


/**
 * Returns the current pathname from the Next.js router.
 *
 * @return {string} The current pathname.
 */
export const useGetPathname = () => {
  const pathname = usePathname();
  return pathname;
}