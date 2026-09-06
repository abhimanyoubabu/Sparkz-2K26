import React from 'react'
import Header from '@/widgets/common/Header'
import Footer from '@/widgets/common/Footer'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div>
          <Header />
            {children}
          <Footer />
      </div>
  )
}
