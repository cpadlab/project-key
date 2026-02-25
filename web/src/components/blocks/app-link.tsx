
import React, { useTransition } from "react"
import { Link as RouterLink, type LinkProps } from "react-router-dom"
import nprogress from "nprogress"
import { useAppNavigate } from "@/hooks/use-app-navigate"

nprogress.configure({ 
    showSpinner: false, 
    speed: 400, 
    minimum: 0.2,
    easing: 'ease'
})

export const AppLink = ({ to, children, ...props }: LinkProps) => {
    
    const { navigate } = useAppNavigate()
    const [isPending, startTransition] = useTransition()

    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
        
        if (props.target === "_blank") return;
        
        e.preventDefault()
        nprogress.start()

        startTransition(() => {
            navigate(to as string)
        })

    }

    return (
        <RouterLink {...props} to={to} onClick={handleNavigation} className={`${props.className || ""} ${isPending ? "cursor-wait" : ""}`}>
            {children}
        </RouterLink>
    )
}