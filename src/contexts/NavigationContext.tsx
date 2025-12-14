import React, { createContext, useState } from 'react'

type Page = 'auth' | 'dashboard' | 'admin'

interface NavigationContextType {
  currentPage: Page
  setPage: (page: Page) => void
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setPage] = useState<Page>('auth')

  return (
    <NavigationContext.Provider value={{ currentPage, setPage }}>
      {children}
    </NavigationContext.Provider>
  )
}
