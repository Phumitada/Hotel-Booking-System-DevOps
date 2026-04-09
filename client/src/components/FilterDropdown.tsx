import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, X, ChevronDown } from 'lucide-react'

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterDropdownProps {
  title: string
  options: FilterOption[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  className?: string
  isOpen?: boolean
  onToggle?: () => void
  multiple?: boolean
}

export default function FilterDropdown({ 
  title, 
  options, 
  selectedValues, 
  onSelectionChange,
  className = "",
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  multiple = true
}: FilterDropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen
  const setIsOpen = isControlled ? controlledOnToggle! : setInternalIsOpen

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, setIsOpen])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleToggleOption = (value: string) => {
    if (multiple) {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value]
      onSelectionChange(newValues)
    } else {
      
      onSelectionChange([value])
    }
  }

  const handleClear = () => {
    onSelectionChange([])
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={handleToggle}
        className={`flex items-center space-x-2 ${multiple ? 'min-w-[160px]' : 'min-w-[200px]'} border-gray-200 hover:border-primary hover:bg-primary/5`}
      >
        <Filter className="w-4 h-4" />
        <span>{title}</span>
        {selectedValues.length > 0 && (
          <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary border-primary/20">
            {multiple ? selectedValues.length : (options.find(o => o.id === selectedValues[0])?.label || selectedValues[0])}
          </Badge>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">{title}</h3>
              {selectedValues.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {options.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-accent cursor-pointer"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type={multiple ? "checkbox" : "radio"}
                      name={multiple ? undefined : `radio-${title}`}
                      checked={selectedValues.includes(option.id)}
                      onChange={() => handleToggleOption(option.id)}
                      className={multiple 
                        ? "rounded border-border text-primary focus:ring-primary" 
                        : "border-border text-primary focus:ring-primary"
                      }
                    />
                    <span className="text-sm text-foreground">{option.label}</span>
                  </div>
                  {option.count && (
                    <span className="text-xs text-muted-foreground">({option.count})</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
