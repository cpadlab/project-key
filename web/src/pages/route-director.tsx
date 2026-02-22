import { Spinner } from "@/components/ui/spinner"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { backendAPI as backend } from "@/lib/api"

const RouteDirector = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        
        const checkInitialRoute = async () => {
            try {
                const route = await backend.getStartupRoute()
                navigate(route, { replace: true }) 
            } catch (error) {
                console.error("Error getting startup route:", error)
                navigate("/welcome", { replace: true })
            } finally {
                setLoading(false)
            }
        }

        checkInitialRoute()

    }, [navigate])

    
    if (loading) {
        return <Spinner />
    }

    return null

}

export default RouteDirector