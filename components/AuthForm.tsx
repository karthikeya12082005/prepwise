"use client"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import FormField from "./FormField"
import { useRouter } from "next/navigation"



const authFormSchema = (type:FormType) => {
    return z.object({
        name: type === 'sign-up'? z.string().min(3).max(50) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(6).max(100),
    })
}

const AuthForm = ({type}:{type:FormType}) => {
    const router = useRouter()
    const formSchema = authFormSchema(type)

    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        email: "",
        password: "",

    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try{
        if (type === "sign-in") {
            toast.success("Sign-in successful!");
            router.push("/");
        } else if (type === "sign-up") {
            toast.success("Account created successfully! Please sign in.");
            router.push("/sign-in");
        }
        form.reset();

    } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(`there was an error submitting the form: ${error}`);
    }
  }

  const isSignIn = type === "sign-in";
  const isSignUp = type === "sign-up" ;

  return (
    <div className="card-border lg:min-w-[556px]">
        <div className="flex flex-col gap-6 card py-14 px-10">
            <div className="flex flex-row gap-2 justify-center">
                <Image src="/logo.svg" height={32} width={38} alt="Logo" />
                <h2 className="text-primary-100">PrepWise</h2>  
            </div>
            <h3 className="text-center text-2xl font-semibold">Practice Job interview with AI </h3>
        
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6 mt-4 form">
                    {!isSignIn && (
                        <FormField control={form.control} name="name" label="Name" placeholder="Your Name"/>)}
                    
                    <p><FormField control={form.control} name="email" label="Email" placeholder="Your Email Address" type="email"/></p>
                    <p><FormField control={form.control} name="password" label="Password" placeholder="Enter your Password" type="password"/></p>
                    <Button className="btn" type="submit">{isSignIn ? 'Sign-In':'Create an Account' }</Button>
                </form>
            </Form>
            <p className="text-center ">
                {isSignIn ? "Don't have an account?": "Already have an account?"}
                <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="text-user-primary ml-1 font-semibold">
                    {isSignIn ? "Sign Up" : "Sign In"}
                </Link>
            </p>
        </div>
    </div>
  );
};
export default AuthForm;