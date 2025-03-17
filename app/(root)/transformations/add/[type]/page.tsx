



import React from 'react'
import Header from '@/components/shared/Header'
import { transformationTypes } from '@/constants'// см. [массив] transformationTypes
//import { NextPage } from 'next';//for testing


//for testing
declare type TransformationTypeKey =
| "restore"
| "fill"
| "remove"
| "recolor"
| "removeBackground";

//for testing
declare type SearchParamProps = {
  params: { id: string; type: TransformationTypeKey };
  searchParams: { [key: string]: string | string[] | undefined };
};



// это страница: app/(root)/transformations/add/[type]/page.tsx
//export default function AddTransformationTypePage({ params: { type } }: SearchParamProps) {
export default async function AddTransformationTypePage({ params }: SearchParamProps) { 

const { type } = await params
console.log(type)

  // см. [массив] transformationTypes
  const transformation = await transformationTypes[type];
  console.log(transformation)

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





