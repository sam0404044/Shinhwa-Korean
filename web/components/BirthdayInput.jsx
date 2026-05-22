'use client';

const years = Array.from({ length: 2027 - 1940 + 1 }, (_, index) => 1940 + index);
const months = Array.from({ length: 12 }, (_, index) => index + 1);
const days = Array.from({ length: 31 }, (_, index) => index + 1);

function padNumber(value) {
  return String(value).padStart(2, '0');
}

export default function BirthdayInput({ value, onChange }) {
  const year = value?.year || '';
  const month = value?.month || '';
  const day = value?.day || '';
  const birthday = year && month && day ? `${year}-${padNumber(month)}-${padNumber(day)}` : '';

  const update = (key, nextValue) => {
    onChange({
      year,
      month,
      day,
      [key]: nextValue,
    });
  };

  return (
    <>
      <div className="form-inline-grid birthday-selects">
        <select
          id="reg-birthday-year"
          value={year}
          onChange={(event) => update('year', event.target.value)}
          aria-label="生日年份"
        >
          <option value="">請選擇年</option>
          {years.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select
          id="reg-birthday-month"
          value={month}
          onChange={(event) => update('month', event.target.value)}
          aria-label="生日月份"
        >
          <option value="">請選擇月</option>
          {months.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
        <select
          id="reg-birthday-day"
          value={day}
          onChange={(event) => update('day', event.target.value)}
          aria-label="生日日期"
        >
          <option value="">請選擇日</option>
          {days.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      <input type="hidden" name="birthday" value={birthday} />
    </>
  );
}
