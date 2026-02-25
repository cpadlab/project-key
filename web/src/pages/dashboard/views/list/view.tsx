import { ListCard } from "./card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { BookmarkIcon, LockIcon, ChevronRightIcon } from "lucide-react";
import { Collapsible, CollapsibleContent,CollapsibleTrigger } from "@/components/ui/collapsible";

import { useGroup } from "@/contexts/group-context";

export const ListView = () => {
    
    const { entries } = useGroup();

    const generalEntries = entries.filter(item => !item.is_favorite);
    const bookmarksEntries = entries.filter(item => item.is_favorite);

    return (
        <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-4">
            
                {bookmarksEntries.length > 0 && (
                    <Collapsible defaultOpen className="group/collapsible">
                        <CollapsibleTrigger className="flex w-full mb-4 items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                            <BookmarkIcon className="size-4 fill-primary text-primary" />
                            <Label className="cursor-pointer">Bookmarks</Label>
                            <Separator className="flex-1" />
                            <ChevronRightIcon className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="space-y-2 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                            {bookmarksEntries.map((item) => (
                                <ListCard key={item.uuid} data={item} />
                            ))}
                        </CollapsibleContent>
                    </Collapsible>
                )}

                <Collapsible defaultOpen className="group/collapsible">
                    <CollapsibleTrigger className="flex w-full mb-4 items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                        <LockIcon className="size-4 text-muted-foreground" />
                        <Label className="cursor-pointer">Entries</Label>
                        <Separator className="flex-1" />
                        <ChevronRightIcon className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                        {generalEntries.length > 0 ? (
                            generalEntries.map((item) => (
                                <ListCard key={item.uuid} data={item} />
                            ))
                        ) : (
                            <div className="py-8 text-center border border-dashed rounded-xl text-xs text-muted-foreground">
                                No entries in this group.
                            </div>
                        )}
                    </CollapsibleContent>
                </Collapsible>

            </div>
        </div>
    )
}