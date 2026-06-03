import { createContext, useContext, useState, useCallback } from 'react'

const translations = {
  en: {
    // Nav titles
    'Dashboard': 'Dashboard',
    'Live Traffic Monitor': 'Live Traffic Monitor',
    'Incident Management': 'Incident Management',
    'Analytics & Reports': 'Analytics & Reports',
    'Vehicle Registry': 'Vehicle Registry',
    'Emergency Alerts': 'Emergency Alerts',
    'User Management': 'User Management',
    'Settings': 'Settings',
    'Commuter Portal': 'Commuter Portal',
    'AI Assistant': 'AI Assistant',
    // Common
    'Sign Out': 'Sign Out',
    'Notifications': 'Notifications',
    // Roles
    'Admin': 'Admin',
    'Commuter': 'Commuter',
    'Traffic Analyst': 'Traffic Analyst',
    'Transport Operator': 'Transport Operator',
  },
  fr: {
    // Nav titles
    'Dashboard': 'Tableau de bord',
    'Live Traffic Monitor': 'Surveillance trafic en direct',
    'Incident Management': 'Gestion des incidents',
    'Analytics & Reports': 'Analytiques & Rapports',
    'Vehicle Registry': 'Registre des véhicules',
    'Emergency Alerts': 'Alertes d\'urgence',
    'User Management': 'Gestion des utilisateurs',
    'Settings': 'Paramètres',
    'Commuter Portal': 'Portail navetteur',
    'AI Assistant': 'Assistant IA',
    // Common
    'Sign Out': 'Se déconnecter',
    'Notifications': 'Notifications',
    // Roles
    'Admin': 'Administrateur',
    'Commuter': 'Navetteur',
    'Traffic Analyst': 'Analyste trafic',
    'Transport Operator': 'Opérateur transport',
  },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const stored = localStorage.getItem('sttms_lang') || 'en'
  const [lang, setLangState] = useState(stored)

  const setLang = useCallback((l) => {
    setLangState(l)
    localStorage.setItem('sttms_lang', l)
  }, [])

  const t = useCallback((key) => translations[lang]?.[key] ?? key, [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)