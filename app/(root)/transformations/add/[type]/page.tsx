



import React from 'react'
import Header from '@/components/shared/Header'
import { transformationTypes } from '@/constants'// см. [массив] transformationTypes
import { NextPage } from 'next';//for testing

// это страница: app/(root)/transformations/add/[type]/page.tsx
//export default function AddTransformationTypePage({ params: { type } }: SearchParamProps) {
  const AddTransformationTypePage: NextPage<SearchParamProps> = ({ params: { type } }) => {//for testing
//export default function AddTransformationTypePage() {

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
export default AddTransformationTypePage;//for testing
