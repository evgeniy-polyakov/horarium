import type { Metadata } from 'next'
import '@fortawesome/fontawesome-svg-core/styles.css'
import '@/assets/scss/index.scss'

export const metadata: Metadata = {
  title: 'Tabula CSV Editor',
  description: '',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
