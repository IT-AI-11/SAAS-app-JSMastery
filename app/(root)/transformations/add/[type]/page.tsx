



import React from 'react'
import Header from '@/components/shared/Header'
import { transformationTypes } from '@/constants'// см. [массив] transformationTypes

// это страница: app/(root)/transformations/add/[type]/page.tsx
export default function AddTransformationTypePage({ params: { type } }: SearchParamProps) {

  // см. [массив] transformationTypes
  const transformation = transformationTypes[type];

  return (
    <>

      <Header
        title={transformation.title}
        subtitle={transformation.subTitle}
      />

    </>
  )
}
