'use client';

import { useState } from 'react';

export default function MotivationField() {
  const [motivation, setMotivation] = useState('');
  const isOther = motivation === 'other';

  return (
    <>
      <div className="form-group">
        <label htmlFor="reg-motivation">學韓文的主要原因</label>
        <select
          id="reg-motivation"
          name="motivation"
          value={motivation}
          onChange={(event) => setMotivation(event.target.value)}
        >
          <option value="" disabled>請選擇</option>
          <option value="interest-study">興趣、進修</option>
          <option value="fan-drama">追星、追劇</option>
          <option value="tourism-travel">觀光、旅遊</option>
          <option value="exam-career-study">考試、工作或求學</option>
          <option value="other">其他</option>
        </select>
      </div>

      {isOther ? (
        <div className="form-group">
          <label htmlFor="reg-motivation-other">其他</label>
          <input
            id="reg-motivation-other"
            type="text"
            name="motivationOther"
            placeholder="例：退休後旅居世界各地，正在學多種語言"
          />
        </div>
      ) : null}
    </>
  );
}
