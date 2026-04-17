'use client';

import { useEffect, useState } from 'react';

function getTodayValue() {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60000;
  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

export default function BirthdayInput() {
  const [maxDate, setMaxDate] = useState('');

  useEffect(() => {
    setMaxDate(getTodayValue());
  }, []);

  return (
    <input
      id="reg-birthday"
      className="date-input date-input--large"
      type="date"
      name="birthday"
      max={maxDate}
      placeholder="請選擇生日"
    />
  );
}
