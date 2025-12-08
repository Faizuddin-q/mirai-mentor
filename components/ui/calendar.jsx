"use client"

import React, { useState } from "react"
import { DayPicker } from "react-day-picker"
import "react-day-picker/dist/style.css"

export function Calendar({ selected, onSelect, required = false, className, ...props }) {
  return (
    <DayPicker
      className={className}
      mode="single"
      animate
      selected={selected}
      onSelect={onSelect}
      required={required}
      {...props}
    />
  )
}
