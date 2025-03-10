"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { type Voice, voices } from "@/lib/voices"

interface VoiceSelectorProps {
  selectedVoice: Voice
  onVoiceChange: (voice: Voice) => void
}

export function VoiceSelector({ selectedVoice, onVoiceChange }: VoiceSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Voice</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {selectedVoice.name}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search voice..." />
            <CommandList>
              <CommandEmpty>No voice found.</CommandEmpty>
              <CommandGroup>
                {voices.map((voice) => (
                  <CommandItem
                    key={voice.name}
                    value={voice.name}
                    onSelect={() => {
                      onVoiceChange(voice)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedVoice.name === voice.name ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex flex-col">
                      <span>{voice.name}</span>
                      <span className="text-xs text-slate-500">
                        {voice.gender} • {voice.style}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

