import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { backendAPI as backend } from "@/lib/api";
import { type GroupModel } from "@/global";

interface DeleteGroupDialogProps {
    groupName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const DeleteGroupDialog = ({ groupName, isOpen, onClose, onSuccess }: DeleteGroupDialogProps) => {
    
    const [deleteMode, setDeleteMode] = useState<"move" | "force">("move");
    const [groups, setGroups] = useState<GroupModel[]>([]);
    const [targetGroup, setTargetGroup] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchGroups = async () => {
                try {
                    const data = await backend.listGroups();
                    const filtered = data.filter(g => g.name !== groupName);
                    setGroups(filtered);
                    if (filtered.length > 0) {
                        const defaultGroup = filtered.find(g => g.name === "Personal") || filtered[0];
                        setTargetGroup(defaultGroup.name);
                    }
                } catch (error) {
                    console.error("Error fetching groups:", error);
                }
            };
            fetchGroups();
        }
    }, [isOpen, groupName]);

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            const force = deleteMode === "force";
            const moveTo = deleteMode === "move" ? targetGroup : null;
            const success = await backend.deleteGroup(groupName, force, moveTo);
            
            if (success) {
                toast.success(`Group '${groupName}' deleted successfully`);
                onSuccess();
                onClose();
            } else {
                toast.error("Failed to delete group");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during deletion");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">

                <DialogHeader>
                    <DialogTitle>Delete Group: {groupName}</DialogTitle>
                    <DialogDescription>
                        This group might contain entries. How would you like to proceed?
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                    <RadioGroup value={deleteMode} onValueChange={(v: string) => setDeleteMode(v as "move" | "force")} className="flex flex-col gap-3" >

                        <div className={`flex flex-col border rounded-md p-3 transition-colors ${deleteMode === 'move' ? 'bg-accent/30 border-primary' : 'hover:bg-accent/50'}`}>
                            <div className="flex items-center space-x-2 mb-2">
                                <RadioGroupItem value="move" id="move" />
                                <Label htmlFor="move" className="flex-1 cursor-pointer font-medium text-sm">
                                    Safety First
                                </Label>
                            </div>
                            {deleteMode === 'move' && (
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-muted-foreground">Select destination group:</span>
                                    <Select value={targetGroup} onValueChange={(v: string) => setTargetGroup(v)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groups.length > 0 ? (
                                                groups.map((g) => (
                                                    <SelectItem key={g.name} value={g.name}>{g.name}</SelectItem>
                                                ))
                                            ) : (<SelectItem value="none" disabled>No other groups available</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>

                        <div className={`flex items-center space-x-2 border p-3 rounded-md transition-colors ${deleteMode === 'force' ? 'bg-destructive/10 border-destructive' : 'hover:bg-accent/50'}`}>
                            <RadioGroupItem value="force" id="force" className="border-destructive text-destructive" />
                            <Label htmlFor="force" className="flex-1 cursor-pointer">
                                <span className="font-medium block text-destructive text-sm">Force Delete</span>
                                <span className="text-[11px] text-muted-foreground">Permanently delete the group and ALL entries inside it.</span>
                            </Label>
                        </div>

                    </RadioGroup>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
                    <Button variant={deleteMode === "force" ? "destructive" : "default"} onClick={handleDelete} disabled={deleteMode === "move" && (!targetGroup || groups.length === 0)}>
                        <span>Confirm Deletion</span>
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};