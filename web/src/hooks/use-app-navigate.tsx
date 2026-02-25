
import { useTransition } from "react"
import { useNavigate, type NavigateOptions } from "react-router-dom"
import nprogress from "nprogress"

export const useAppNavigate = () => {

    const navigate = useNavigate()
    const [isPending, startTransition] = useTransition()

    const appNavigate = (to: string, options?: NavigateOptions) => {
        nprogress.start()
        startTransition(() => {
            navigate(to, options)
        })
    }

    return { navigate: appNavigate, isPending }

}