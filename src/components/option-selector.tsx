
// src/components/option-selector.tsx
"use client";

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { CandleColorOption, CandleScentOption } from '@/config/candle-options';
import { ChevronDown } from 'lucide-react';

type Option = CandleColorOption | CandleScentOption;

interface OptionSelectorProps<T extends Option> {
  options: T[];
  selectedOption: T;
  onSelectOption: (option: T) => void;
  optionType: 'color' | 'scent';
  uniqueIdPrefix: string;
}

const OptionCircle = ({ option }: { option: Option }) => (
  <span
    className="h-5 w-5 rounded-full border"
    style={{ backgroundColor: option.hexColor }}
  />
);

export default function OptionSelector<T extends Option>({
  options,
  selectedOption,
  onSelectOption,
  optionType,
}: OptionSelectorProps<T>) {

  const handleValueChange = (value: string) => {
    const option = options.find(o => o.value === value);
    if (option) {
      onSelectOption(option as T);
    }
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-auto rounded-full flex items-center justify-center p-1 gap-1"
              aria-label={`Seleccionar ${optionType}`}
            >
              <OptionCircle option={selectedOption} />
              <ChevronDown className="h-4 w-4 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Cambiar {optionType === 'color' ? 'Color' : 'Aroma'}</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent className="w-56">
        {/* The DropdownMenuLabel has been removed as requested */}
        <DropdownMenuRadioGroup value={selectedOption.value} onValueChange={handleValueChange}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value} className="flex items-center gap-2 cursor-pointer">
              <OptionCircle option={option} />
              <span>{option.name}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
