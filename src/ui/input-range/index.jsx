'use client';
import { getTrackBackground, Range } from "react-range";

const InputRange = ({ STEP = 1, MIN = 0, MAX = 1000, values, handleChanges }) => {
  // Ensure MAX is at least greater than MIN
  const validMax = Math.max(MAX || 1000, MIN + 1);
  const validValues = values?.map(v => Math.min(Math.max(v, MIN), validMax)) || [MIN, validMax];

  return (
    <>
      <Range
        step={STEP}
        min={MIN}
        max={validMax}
        values={validValues}
        onChange={(vals) => handleChanges(vals)}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            key={props.key}
            style={{
              ...props.style,
              height: '3px',
              width: '100%',
              background: getTrackBackground({
                values: validValues,
                colors: ["#EDEDED", "#0989FF", "#EDEDED"],
                min: MIN,
                max: validMax
              }),
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            key={props.key}
            style={{
              ...props.style,
              height: '17px',
              width: '5px',
              backgroundColor: isDragged ? "#0989FF" : "#0989FF",
              cursor: 'pointer'
            }}
          />
        )}
      />
    </>
  );
};

export default InputRange;
