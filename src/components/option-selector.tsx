
// src/components/option-selector.tsx
"use client";

import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown } from "lucide-react";
import type { CandleColorOption, CandleScentOption } from '@/config/candle-options';

type Option = CandleColorOption | CandleScentOption;

interface OptionSelectorProps<T extends Option> {
  options: T[];
  selectedOption: T;
  onSelectOption: (option: T) => void;
  optionType: 'color' | 'scent';
  uniqueIdPrefix: string;
  visibleOptionsCount?: number;
}

const OptionCircle = ({ option }: { option: Option }) => (
  <span
    className="h-5 w-5 rounded-full border-2 border-transparent"
    style={{ backgroundColor: option.hexColor }}
  />
);

export default function OptionSelector<T extends Option>({
  options,
  selectedOption,
  onSelectOption,
  optionType,
  uniqueIdPrefix,
  visibleOptionsCount = 5,
}: OptionSelectorProps<T>) {

  const visibleOptions = options.slice(0, visibleOptionsCount);
  const hiddenOptions = options.slice(visibleOptionsCount);

  const handleValueChange = (value: string) => {
    const option = options.find(o => o.value === value);
    if (option) {
      onSelectOption(option as T);
    }
  };

  const isOptionInHidden = hiddenOptions.some(opt => opt.value === selectedOption.value);

  return (
    <div className="flex items-center gap-3">
      <RadioGroup
        value={selectedOption.value}
        onValueChange={handleValueChange}
        className="flex flex-wrap gap-3"
        aria-label={`Opciones de ${optionType}`}
      >
        {visibleOptions.map((option) => (
          <Tooltip key={option.value}>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <RadioGroupItem
                  value={option.value}
                  id={`${uniqueIdPrefix}-${option.value}`}
                  className="sr-only peer"
                  aria-label={option.name}
                />
                <Label
                  htmlFor={`${uniqueIdPrefix}-${option.value}`}
                  className="h-5 w-5 rounded-full border-2 border-transparent cursor-pointer transition-all
                             peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-ring peer-data-[state=checked]:ring-offset-2 
                             peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-1"
                  style={{ backgroundColor: option.hexColor }}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{option.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </RadioGroup>

      {hiddenOptions.length > 0 && (
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 rounded-full flex items-center justify-center
                              ${isOptionInHidden ? 'ring-2 ring-ring ring-offset-1' : ''}`}
                >
                  {isOptionInHidden ? (
                    <OptionCircle option={selectedOption} />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  <span className="sr-only">Más opciones</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Más {optionType === 'color' ? 'colores' : 'aromas'}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenuContent>
            <DropdownMenuLabel>Selecciona un {optionType}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={selectedOption.value} onValueChange={handleValueChange}>
              {hiddenOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value} className="flex items-center gap-2">
                  <OptionCircle option={option} />
                  <span>{option.name}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
