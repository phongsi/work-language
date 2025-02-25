"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const roles = [
  {
    value: "front-desk",
    label: "Front Desk",
  },
  {
    value: "fmb",
    label: "Food and Beverage",
  },
  {
    value: "housekeeping",
    label: "House Keeping",
  }
]

export function SearchRole() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

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
            {value ? roles.find((role) => role.value === value)?.label : "Search roles..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search industries..." className="h-12" />
            <CommandList>
              <CommandEmpty>No role found.</CommandEmpty>
              <CommandGroup>
                {roles.map((role) => (
                  <CommandItem
                    key={role.value}
                    value={role.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                      router.push('/onboard/confirmation')
                    }}
                  >
                    <Check className={cn("mr-2 h-4 w-4", value === role.value ? "opacity-100" : "opacity-0")} />
                    {role.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role.value}
            onClick={() => {
              setValue(role.value)
              setOpen(false)
              router.push('/onboard/confirmation')
            }}
            className="rounded-xl border border-gray-200 p-6 text-left transition-colors hover:bg-gray-50"
          >
            <h3 className="font-medium text-gray-900">{role.label}</h3>
          </button>
        ))}
      </div>
    </div>
  )
}

