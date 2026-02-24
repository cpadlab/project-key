import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

import { backendAPI as backend } from "@/lib/api"

export function CloseConfirmationDialog() {

    const [open, setOpen] = useState(false)
    const [remember, setRemember] = useState(false)

    useEffect(() => {
        const handleCloseRequest = () => setOpen(true)    
        window.addEventListener('show-close-dialog', handleCloseRequest)
        return () => window.removeEventListener('show-close-dialog', handleCloseRequest)
    }, [])

    const handleAction = async (action: 'minimize' | 'exit') => {
        if (remember) {
            await backend.setCloseBehavior(action);
        }
        if (action === 'minimize') {
            await backend.minimizeWindow();
        } else {
            await backend.exitApplication();
        }   
        setOpen(false);
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>

                <AlertDialogHeader>
                    <AlertDialogTitle>¿Deseas cerrar la aplicación?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Puedes salir completamente de Project Key o minimizarla en la bandeja del sistema para seguir recibiendo notificaciones.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="flex items-center space-x-2 py-4">
                    <Checkbox id="remember" checked={remember} onCheckedChange={(checked) => setRemember(!!checked)} />
                    <Label htmlFor="remember" className="text-sm font-medium leading-none">Recordar mi elección</Label>
                </div>

                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel onClick={() => handleAction('minimize')}>
                        Solo minimizar
                    </AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => handleAction('exit')}>
                        Cerrar aplicación
                    </AlertDialogAction>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    )
}