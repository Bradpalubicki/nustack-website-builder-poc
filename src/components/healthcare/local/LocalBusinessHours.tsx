'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BusinessHours, DayHours } from '@/types/healthcare';

export type BusinessHoursVariant = 'table' | 'list' | 'compact';

export interface HolidayHours {
  date: string;
  name: string;
  hours?: DayHours;
  closed?: boolean;
}

export interface LocalBusinessHoursProps {
  /** Business hours by day */
  hours: BusinessHours;
  /** Special holiday hours */
  holidayHours?: HolidayHours[];
  /** Timezone (e.g., "America/Chicago") */
  timezone?: string;
  /** Show today first */
  showTodayFirst?: boolean;
  /** Display variant */
  variant?: BusinessHoursVariant;
  /** Additional CSS classes */
  className?: string;
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

/**
 * Get today's day name
 */
function getTodayKey(): string {
  return DAY_ORDER[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
}

/**
 * Check if currently open
 */
function isCurrentlyOpen(hours: BusinessHours): { isOpen: boolean; closesAt?: string } {
  const todayKey = getTodayKey();
  const todayHours = hours[todayKey as keyof BusinessHours];

  if (!todayHours || todayHours.closed) {
    return { isOpen: false };
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const parseTime = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour = hours;
    if (period?.toLowerCase() === 'pm' && hours !== 12) hour += 12;
    if (period?.toLowerCase() === 'am' && hours === 12) hour = 0;
    return hour * 60 + (minutes || 0);
  };

  const openTime = parseTime(todayHours.open);
  const closeTime = parseTime(todayHours.close);

  if (currentMinutes >= openTime && currentMinutes < closeTime) {
    return { isOpen: true, closesAt: todayHours.close };
  }

  return { isOpen: false };
}

/**
 * Format hours for display
 */
function formatHours(dayHours?: DayHours): string {
  if (!dayHours || dayHours.closed) {
    return 'Closed';
  }
  return `${dayHours.open} - ${dayHours.close}`;
}

/**
 * LocalBusinessHours Component
 *
 * Formatted business hours display.
 * Supports schema.org openingHours format.
 */
export function LocalBusinessHours({
  hours,
  holidayHours,
  timezone,
  showTodayFirst = true,
  variant = 'table',
  className,
}: LocalBusinessHoursProps) {
  const todayKey = getTodayKey();
  const { isOpen, closesAt } = isCurrentlyOpen(hours);

  // Order days with today first if requested
  const orderedDays = showTodayFirst
    ? [todayKey, ...DAY_ORDER.filter((d) => d !== todayKey)]
    : DAY_ORDER;

  // Generate schema.org openingHours
  const schemaHours = DAY_ORDER.map((day) => {
    const dayHours = hours[day as keyof BusinessHours];
    if (!dayHours || dayHours.closed) return null;

    const dayAbbrev = day.substring(0, 2).charAt(0).toUpperCase() + day.substring(1, 2);
    return `${dayAbbrev} ${dayHours.open.replace(' ', '')}-${dayHours.close.replace(' ', '')}`;
  }).filter(Boolean);

  // Check for upcoming holiday
  const upcomingHoliday = holidayHours?.find((h) => {
    const holidayDate = new Date(h.date);
    const today = new Date();
    const daysDiff = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff >= 0 && daysDiff <= 7;
  });

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="flex items-center gap-2">
          {isOpen ? (
            <>
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Open Now
              </Badge>
              <span className="text-sm text-muted-foreground">Closes at {closesAt}</span>
            </>
          ) : (
            <Badge variant="secondary">
              <XCircle className="h-3 w-3 mr-1" />
              Closed
            </Badge>
          )}
        </div>
        <meta itemProp="openingHours" content={schemaHours.join(', ')} />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={cn('space-y-2', className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Hours</span>
          </div>
          {isOpen ? (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Open
            </Badge>
          ) : (
            <Badge variant="secondary">Closed</Badge>
          )}
        </div>
        <ul className="space-y-1 text-sm">
          {orderedDays.map((day) => {
            const dayHours = hours[day as keyof BusinessHours];
            const isToday = day === todayKey;
            return (
              <li
                key={day}
                className={cn(
                  'flex justify-between py-1',
                  isToday && 'font-medium text-primary'
                )}
              >
                <span>{DAY_LABELS[day]}</span>
                <span className={!dayHours || dayHours.closed ? 'text-muted-foreground' : ''}>
                  {formatHours(dayHours)}
                </span>
              </li>
            );
          })}
        </ul>
        {upcomingHoliday && (
          <div className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">{upcomingHoliday.name}</p>
              <p>
                {new Date(upcomingHoliday.date).toLocaleDateString()}:{' '}
                {upcomingHoliday.closed ? 'Closed' : formatHours(upcomingHoliday.hours)}
              </p>
            </div>
          </div>
        )}
        <meta itemProp="openingHours" content={schemaHours.join(', ')} />
      </div>
    );
  }

  // Table variant (default)
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span className="font-semibold">Business Hours</span>
        </div>
        {isOpen ? (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Open Now
          </Badge>
        ) : (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Closed
          </Badge>
        )}
      </div>

      <table className="w-full text-sm">
        <tbody>
          {orderedDays.map((day) => {
            const dayHours = hours[day as keyof BusinessHours];
            const isToday = day === todayKey;
            const isClosed = !dayHours || dayHours.closed;

            return (
              <tr
                key={day}
                className={cn(
                  'border-b last:border-0',
                  isToday && 'bg-primary/5'
                )}
              >
                <td className={cn('py-2 pr-4', isToday && 'font-semibold')}>
                  {DAY_LABELS[day]}
                  {isToday && <span className="ml-2 text-xs text-primary">(Today)</span>}
                </td>
                <td
                  className={cn(
                    'py-2 text-right',
                    isClosed ? 'text-muted-foreground' : isToday && 'font-semibold'
                  )}
                >
                  {formatHours(dayHours)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {upcomingHoliday && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
          <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{upcomingHoliday.name} Hours</p>
            <p className="text-sm">
              {new Date(upcomingHoliday.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
              : {upcomingHoliday.closed ? 'Closed' : formatHours(upcomingHoliday.hours)}
            </p>
          </div>
        </div>
      )}

      {timezone && (
        <p className="text-xs text-muted-foreground">All times in {timezone}</p>
      )}

      <meta itemProp="openingHours" content={schemaHours.join(', ')} />
    </div>
  );
}

export default LocalBusinessHours;
