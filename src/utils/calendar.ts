/**
 * Generates an .ics file download and Google Calendar web link for the 11th 03:00 date.
 */
export function downloadIcsCalendarEvent(recipientName: string) {
  // Determine date: next 11th at 03:00 AM
  const now = new Date();
  let targetYear = now.getFullYear();
  let targetMonth = now.getMonth();

  // If today is past the 11th 3am, schedule for next month's 11th
  const thisMonth11th = new Date(targetYear, targetMonth, 11, 3, 0, 0);
  if (now.getTime() > thisMonth11th.getTime()) {
    targetMonth += 1;
    if (targetMonth > 11) {
      targetMonth = 0;
      targetYear += 1;
    }
  }

  const startDate = new Date(targetYear, targetMonth, 11, 3, 0, 0);
  const endDate = new Date(targetYear, targetMonth, 11, 5, 0, 0); // 2 hours date

  const formatIcsTime = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const title = 'Волшебное свидание с любимым 🦉⚡';
  const description = `${recipientName}, 11 число в 3 часа ночи — навсегда наш момент! Я тебя очень люблю. Отказы не принимаются 💙`;
  const location = 'Наше особенное место под ночными звёздами 🌌';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Hogwarts Owl Post//Romantic Date//RU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:hogwarts-date-${Date.now()}@romantic-date.com`,
    `DTSTAMP:${formatIcsTime(new Date())}`,
    `DTSTART:${formatIcsTime(startDate)}`,
    `DTEND:${formatIcsTime(endDate)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    'DESCRIPTION:Скоро вылет совы на свидание 11 числа в 03:00! 🦉✨',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Hogwarts_Date_11_Night.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
