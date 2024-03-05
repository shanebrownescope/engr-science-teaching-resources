"use client"
import { usePathname } from 'next/navigation';

export const useGetPathname = () => {
  const pathname = usePathname();
  return pathname;
}