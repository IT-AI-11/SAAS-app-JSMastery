



import React from 'react'



// to app/(root)/transformations/add/[type]/page.tsx
const Header = ({ title, subtitle }: { title: string, subtitle?: string }) => {// типы для TypeScript прям в этой строке
  return (
    <>
      <h2 className="h2-bold text-dark-600">{title}</h2>
      {subtitle && <p className="p-16-regular mt-4">{subtitle}</p>}
    </>
  )
}

export default Header
