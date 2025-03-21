


"use client"

import React from 'react'
import { CustomField } from './CustomField'
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils"
import { updateCredits } from '@/lib/actions/user.actions'
//import MediaUploader from "./MediaUploader"
//import TransformedImage from "./TransformedImage"


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
import MediaUploader from './MediaUploader'




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




    // 1
    const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
        const imageSize = aspectRatioOptions[value as AspectRatioKey]

        setImage((prevState: any) => ({
            ...prevState,
            aspectRatio: imageSize.aspectRatio,
            width: imageSize.width,
            height: imageSize.height,
        }))
        setNewTransformation(transformationType.config);
        return onChangeField(value)
    }




    // 2
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




    // 3
    const onTransformHandler = async () => {
        setIsTransforming(true)
        setTransformationConfig(
            deepMergeObjects(newTransformation, transformationConfig)
        )
        setNewTransformation(null)
        startTransition(async () => {
            await updateCredits(userId, creditFee)
        })
    }


  





    return (
  

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






                 <div className="media-uploader-field">
                     <CustomField
                        control={form.control}
                        name="publicId"
                        className="flex size-full flex-col"
                        render={({ field }) => (

                            <MediaUploader
                                onValueChange={field.onChange}
                                setImage={setImage}
                                publicId={field.value}
                                image={image}
                                type={type}
                            />

                        )}
                    />

                  {/*   <TransformedImage
                        image={image}
                        type={type}
                        title={form.getValues().title}
                        isTransforming={isTransforming}
                        setIsTransforming={setIsTransforming}
                        transformationConfig={transformationConfig}
                    /> 
                     */}


                </div>
            






                <div className="flex flex-col gap-4">
                    <Button
                        type="button"
                        className="submit-button capitalize"
                        disabled={isTransforming || newTransformation === null}
                        onClick={onTransformHandler}
                    >
                        {isTransforming ? 'Transforming...' : 'Apply Transformation'}
                    </Button>
                    <Button
                        type="submit"
                        className="submit-button capitalize"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Save Image'}
                    </Button>
                </div>










            </form>
        </Form>









    )
}
