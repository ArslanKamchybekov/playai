"use client"

import { Slider } from "@/components/ui/slider"

interface PlaySettingsProps {
  speed: number
  onSpeedChange: (speed: number) => void
  temperature: number
  onTemperatureChange: (temperature: number) => void
}

export function PlaySettings({ speed, onSpeedChange, temperature, onTemperatureChange }: PlaySettingsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Speed</label>
          <span className="text-sm text-slate-500">{speed.toFixed(1)}x</span>
        </div>
        <Slider value={[speed]} min={0.5} max={2} step={0.1} onValueChange={(value) => onSpeedChange(value[0])} />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Temperature</label>
          <span className="text-sm text-slate-500">{temperature.toFixed(1)}</span>
        </div>
        <Slider
          value={[temperature]}
          min={0}
          max={1}
          step={0.1}
          onValueChange={(value) => onTemperatureChange(value[0])}
        />
      </div>
    </div>
  )
}

