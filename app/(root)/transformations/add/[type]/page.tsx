



import React from 'react'
import Header from '@/components/shared/Header'
import { transformationTypes } from '@/constants'// см. [массив] transformationTypes
import TransformationForm from '@/components/shared/TransformationForm'
import { auth } from '@clerk/nextjs/server'
import { getUserById } from '@/lib/actions/user.actions'
//import { NextPage } from 'next';//for testing

import { redirect } from 'next/navigation';


//for testing
// declare type TransformationTypeKey =
// | "restore"
// | "fill"
// | "remove"
// | "recolor"
// | "removeBackground";

//for testing
// declare type SearchParamProps = {
//   params: Promise<{ id: string; type: TransformationTypeKey }>;
//   searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
// };



// это страница: app/(root)/transformations/add/[type]/page.tsx
//export default function AddTransformationTypePage({ params: { type } }: SearchParamProps) {   original
export default async function AddTransformationTypePage({ params }: SearchParamProps) { //new WORKS !!!

  const { userId } = await auth();

  if(!userId) redirect('/sign-in')
  const user = await getUserById(userId);// userId from MongoDB

const { type } = await params // new approach with `await`
//console.log(type)

  // см. [массив] transformationTypes
  const transformation = await transformationTypes[type]; // new approach with `await`
  // console.log(transformation)
  // console.log(transformation.title)
  // console.log(transformation.subTitle)

  return (
    <>

      <Header
        // original
         title={transformation.title}
         subtitle={transformation.subTitle}

        //title="title test"
        //subtitle="subtitle test"
      />

      <section className="mt-10">
        <TransformationForm 
          action="Add"
          userId={user._id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>

    </>
  )
}





