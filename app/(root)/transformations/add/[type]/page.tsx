



import React from 'react'
import Header from '@/components/shared/Header'
import { transformationTypes } from '@/constants'// см. [массив] transformationTypes
//import { NextPage } from 'next';//for testing

// это страница: app/(root)/transformations/add/[type]/page.tsx
//export default function AddTransformationTypePage({ params: { type } }: SearchParamProps) {     original
export default async function AddTransformationTypePage({ params }: SearchParamProps) { 

const { type } = await params

  // см. [массив] transformationTypes
  const transformation = transformationTypes[type];

  return (
    <>

      <Header
        // original
         title={transformation.title}
         subtitle={transformation.subTitle}

        //title="title test"
        //subtitle="subtitle test"
      />

    </>
  )
}

