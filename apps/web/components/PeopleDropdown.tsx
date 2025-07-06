"use client";
import { useState, useEffect, FC } from "react";
import PersonIcon from "./PersonIcon";

interface CounterProps {
  label: string;
  description: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
}

const Counter: FC<CounterProps> = ({ label, description, count, onIncrement, onDecrement, min = 0, max = 8 }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="font-semibold">{label}</p>
            {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
        <div className="flex items-center space-x-4">
            <button
                type="button"
                onClick={onDecrement}
                disabled={count <= min}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 disabled:opacity-50 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
            >
                -
            </button>
            <span className="w-4 text-center font-semibold">{count}</span>
            <button
                type="button"
                onClick={onIncrement}
                disabled={count >= max}
                className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 disabled:opacity-50 flex items-center justify-center bg-gray-100 dark:bg-gray-700"
            >
                +
            </button>
        </div>
    </div>
);

interface PeopleDropdownProps {
  selected: { adults: number; children: number; infants: number; };
  onSelect: (v: { adults: number; children: number; infants: number; }) => void;
  className?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function PeopleDropdown({ selected, onSelect, className = '', isOpen, onToggle }: PeopleDropdownProps) {
  const [tempAdults, setTempAdults] = useState(selected.adults);
  const [tempChildren, setTempChildren] = useState(selected.children);
  const [tempInfants, setTempInfants] = useState(selected.infants);

  const totalTravelers = selected.adults + selected.children + selected.infants;

  useEffect(() => {
    if (isOpen) {
      setTempAdults(selected.adults);
      setTempChildren(selected.children);
      setTempInfants(selected.infants);
    }
  }, [isOpen, selected]);

  const handleDone = () => {
    onSelect({ adults: tempAdults, children: tempChildren, infants: tempInfants });
    onToggle();
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        className="w-full h-12 flex items-center px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100 shadow"
        onClick={onToggle}
      >
        <PersonIcon />
        <span className="ml-2">{totalTravelers}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-80 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg p-4">
            <Counter
                label="Adults"
                description=""
                count={tempAdults}
                onIncrement={() => setTempAdults(a => Math.min(8 - tempChildren - tempInfants, a + 1))}
                onDecrement={() => setTempAdults(a => Math.max(1, a - 1))}
                min={1}
                max={8 - tempChildren - tempInfants}
            />
             <Counter
                label="Children"
                description="Aged 2-11"
                count={tempChildren}
                onIncrement={() => setTempChildren(c => Math.min(8 - tempAdults - tempInfants, c + 1))}
                onDecrement={() => setTempChildren(c => Math.max(0, c - 1))}
                max={8 - tempAdults - tempInfants}
            />
            <Counter
                label="Infants"
                description="Under 2"
                count={tempInfants}
                onIncrement={() => setTempInfants(i => Math.min(8 - tempAdults - tempChildren, i + 1))}
                onDecrement={() => setTempInfants(i => Math.max(0, i - 1))}
                max={8 - tempAdults - tempChildren}
            />
            <hr className="my-2 border-gray-200 dark:border-gray-600" />
            <div className="flex justify-end space-x-6 mt-2">
                 <button type="button" onClick={onToggle} className="font-semibold text-gray-600 dark:text-gray-300 hover:text-primary">Cancel</button>
                 <button type="button" onClick={handleDone} className="font-semibold text-primary dark:text-primary-dark hover:underline">Done</button>
            </div>
        </div>
      )}
    </div>
  );
}