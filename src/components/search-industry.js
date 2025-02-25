"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useRouter } from 'next/navigation'

const industries = [
  {
    value: "hotel",
    label: "Hotel",
  },
  {
    value: "healthcare",
    label: "Healthcare",
  },
  {
    value: "technology",
    label: "Technology",
  },
  {
    value: "education",
    label: "Education",
  },
  {
    value: "finance",
    label: "Finance",
  },
  {
    value: "retail",
    label: "Retail",
  },
]

export function SearchIndustry() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const router = useRouter()

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between rounded-xl border-gray-200 px-6 py-8 text-left text-lg hover:bg-gray-50"
          >
            {value ? industries.find((industry) => industry.value === value)?.label : "Search industries..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search industries..." className="h-12" />
            <CommandList>
              <CommandEmpty>No industry found.</CommandEmpty>
              <CommandGroup>
                {industries.map((industry) => (
                  <CommandItem
                    key={industry.value}
                    value={industry.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                      router.push('/onboard/role')
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === industry.value ? "opacity-100" : "opacity-0")} />
                    {industry.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry) => (
          <button
            key={industry.value}
            onClick={() => {
              setValue(industry.value)
              setOpen(false)
              router.push('/onboard/role')
            }}
            className="rounded-xl border border-gray-200 p-6 text-left transition-colors hover:bg-gray-50"
          >
            <h3 className="font-medium text-gray-900">{industry.label}</h3>
          </button>
        ))}
      </div>
    </div>
  )
}

