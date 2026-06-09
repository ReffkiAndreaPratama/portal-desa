import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

export default function BackToTop() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!show) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-24 right-4 sm:right-6 z-40 w-11 h-11 bg-white border-3 border-[#212121] rounded-xl shadow-[3px_3px_0_#212121] flex items-center justify-center hover:bg-[#2E7D32] hover:text-white hover:shadow-[5px_5px_0_#212121] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
      title="Kembali ke atas"
    >
      <ChevronUp size={18} />
    </button>
  )
}
