import { useState, useEffect, useRef } from 'react'

interface PriceRangeSliderProps {
  min: number
  max: number
  value: { min: number; max: number }
  onChange: (value: { min: number; max: number }) => void
  className?: string
}

export default function PriceRangeSlider({ min, max, value, onChange, className = '' }: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMouseDown = (handle: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(handle)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return

    const rect = sliderRef.current.getBoundingClientRect()
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newValue = min + percentage * (max - min)

    if (isDragging === 'min') {
      const constrainedMin = Math.min(newValue, localValue.max)
      const newValueObj = { min: constrainedMin, max: localValue.max }
      setLocalValue(newValueObj)
      onChange(newValueObj)
    } else {
      const constrainedMax = Math.max(newValue, localValue.min)
      const newValueObj = { min: localValue.min, max: constrainedMax }
      setLocalValue(newValueObj)
      onChange(newValueObj)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(null)
  }

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, localValue, min, max])

  const leftPercentage = ((localValue.min - min) / (max - min)) * 100
  const rightPercentage = ((localValue.max - min) / (max - min)) * 100

  return (
    <div className={`price-range-slider ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm text-gray-600">Price Range:</span>
        <span className="text-sm font-medium text-gray-900">
          ฿{Math.round(localValue.min)} - ฿{Math.round(localValue.max)}
        </span>
      </div>
      
      <div 
        ref={sliderRef}
        className="relative h-8 cursor-pointer select-none"
        onMouseDown={(e) => {
          const rect = sliderRef.current!.getBoundingClientRect()
          const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
          const newValue = min + percentage * (max - min)
          
          // Determine which handle is closer
          const distanceToMin = Math.abs(newValue - localValue.min)
          const distanceToMax = Math.abs(newValue - localValue.max)
          
          if (distanceToMin < distanceToMax) {
            const constrainedMin = Math.min(newValue, localValue.max)
            const newValueObj = { min: constrainedMin, max: localValue.max }
            setLocalValue(newValueObj)
            onChange(newValueObj)
          } else {
            const constrainedMax = Math.max(newValue, localValue.min)
            const newValueObj = { min: localValue.min, max: constrainedMax }
            setLocalValue(newValueObj)
            onChange(newValueObj)
          }
        }}
      >
        {/* Track background */}
        <div className="absolute top-3 left-0 right-0 h-2 bg-gray-200 rounded-full" />
        
        {/* Active range */}
        <div 
          className="absolute top-3 h-2 bg-blue-500 rounded-full pointer-events-none"
          style={{
            left: `${leftPercentage}%`,
            width: `${rightPercentage - leftPercentage}%`
          }}
        />
        
        {/* Min handle */}
        <div 
          className={`absolute top-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md transition-colors hover:bg-blue-600 cursor-grab active:cursor-grabbing ${
            isDragging === 'min' ? 'bg-blue-600 scale-110' : ''
          }`}
          style={{ left: `calc(${leftPercentage}% - 8px)` }}
          onMouseDown={handleMouseDown('min')}
        />
        
        {/* Max handle */}
        <div 
          className={`absolute top-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-md transition-colors hover:bg-blue-600 cursor-grab active:cursor-grabbing ${
            isDragging === 'max' ? 'bg-blue-600 scale-110' : ''
          }`}
          style={{ left: `calc(${rightPercentage}% - 8px)` }}
          onMouseDown={handleMouseDown('max')}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>฿{min}</span>
        <span>฿{max}</span>
      </div>
    </div>
  )
}
