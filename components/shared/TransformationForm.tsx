


"use client"

import React from 'react'
import { CustomField } from './CustomField'
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"

//#region [rgba(2, 196, 15, 0.2)]
// the code in this 'region' is from ShadcnUI React-Hook-Form + Zod
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from '@/constants'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"



// const formSchema = z.object({
//   username: z.string().min(2).max(50),
// })

//#endregion

export const formSchema = z.object({
    title: z.string(),
    aspectRatio: z.string().optional(),
    color: z.string().optional(),
    prompt: z.string().optional(),
    publicId: z.string(),
})





// to app/(root)/transformations/add/[type]/page.tsx
export default function TransformationForm({ action, data = null, userId, type, creditBalance, config = null }: TransformationFormProps) {


    const transformationType = transformationTypes[type];
    const [image, setImage] = useState(data)
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformationConfig, setTransformationConfig] = useState(config)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()


    const initialValues = data && action === 'Update' ? {
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
    } : defaultValues

    //#region [rgba(2, 196, 15, 0.2)]
    // the code in this 'region' is from ShadcnUI React-Hook-Form + Zod
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // defaultValues: { username: "", },   original
        defaultValues: initialValues
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    //#endregion



    const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
        // const imageSize = aspectRatioOptions[value as AspectRatioKey]

        // setImage((prevState: any) => ({
        //   ...prevState,
        //   aspectRatio: imageSize.aspectRatio,
        //   width: imageSize.width,
        //   height: imageSize.height,
        // }))

        // setNewTransformation(transformationType.config);

        // return onChangeField(value)
    }


    const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
        debounce(() => {
            setNewTransformation((prevState: any) => ({
                ...prevState,
                [type]: {
                    ...prevState?.[type],
                    [fieldName === 'prompt' ? 'prompt' : 'to']: value
                }
            }))
        }, 1000)();

        return onChangeField(value)
    }





    return (
        //#region [rgba(2, 196, 15, 0.2)]

        //     <Form {...form}>
        //     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        //       {/* <FormField
        //         control={form.control}
        //         name="username"
        //         render={({ field }) => (
        //           <FormItem>
        //             <FormLabel>Username</FormLabel>
        //             <FormControl>
        //               <Input placeholder="shadcn" {...field} />
        //             </FormControl>
        //             <FormDescription>
        //               This is your public display name.
        //             </FormDescription>
        //             <FormMessage />
        //           </FormItem>
        //         )}
        //       />
        //       <Button type="submit">Submit</Button> */}
        //     </form>
        //   </Form>

        //#endregion



        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* #1 */}
                <CustomField
                    control={form.control}
                    name="title"
                    formLabel="Image Title"
                    className="w-full"
                    render={({ field }) => <Input {...field} className="input-field" />}
                />

             
                {type === 'fill' && (

                       // #2 
                    <CustomField
                        control={form.control}
                        name="aspectRatio"
                        formLabel="Aspect Ratio"
                        className="w-full"
                        render={({ field }) => (
                            <Select
                                onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                                value={field.value}
                            >
                                <SelectTrigger className="select-field">
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(aspectRatioOptions).map((key) => (
                                        <SelectItem key={key} value={key} className="select-item">
                                            {aspectRatioOptions[key as AspectRatioKey].label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                )}

                {/* #3 */}
                {(type === 'remove' || type === 'recolor') && (
                    <div className="prompt-field">
                          {/* #3 */}
                        <CustomField
                            control={form.control}
                            name="prompt"
                            formLabel={
                                type === 'remove' ? 'Object to remove' : 'Object to recolor'
                            }
                            className="w-full"
                            render={({ field }) => (
                                <Input
                                    value={field.value}
                                    className="input-field"
                                    onChange={(e) => onInputChangeHandler(
                                        'prompt',
                                        e.target.value,
                                        type,
                                        field.onChange
                                    )}
                                />
                            )}
                        />

                        {type === 'recolor' && (
                              // #4 
                            <CustomField
                                control={form.control}
                                name="color"
                                formLabel="Replacement Color"
                                className="w-full"
                                render={({ field }) => (
                                    <Input
                                        value={field.value}
                                        className="input-field"
                                        onChange={(e) => onInputChangeHandler(
                                            'color',
                                            e.target.value,
                                            'recolor',
                                            field.onChange
                                        )}
                                    />
                                )}
                            />
                        )}
                    </div>
                )}



                






            </form>
        </Form>









    )
}
