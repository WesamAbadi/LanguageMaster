import React, { useState, forwardRef, useImperativeHandle } from "react";
import "../../styles/components/TextCompare.scss";
const TextCompare = forwardRef(
  ({ dmp, lessonData, transcript, markLessonCompleted }, ref) => {
    const [comparisonResult, setComparisonResult] = useState(null);

    useImperativeHandle(ref, () => ({
      getAlert() {
        alert("getAlert from Child");
      },
      compareAndHighlight() {
        const content = lessonData.content
          .replace(/[^a-zA-Z\s]/g, "")
          .toLowerCase();
        const transcript2 = transcript
          .replace(/[^a-zA-Z\s]/g, "")
          .toLowerCase();

        const differences = dmp.diff_main(transcript2, content);
        dmp.diff_cleanupSemantic(differences);

        const matchPercentage = (
          (1 -
            dmp.diff_levenshtein(differences) /
              Math.max(transcript2.length, content.length)) *
          100
        ).toFixed(2);

        if (matchPercentage >= 70) {
          markLessonCompleted();
        }

        const diffElements = differences.map((diff, index) => {
          const key = `${diff[0]}_${index}`;
          let className = "neutral";

          if (diff[0] === -1) {
            className = "difference-wrong";
          } else if (diff[0] === 0) {
            className = "difference-correct";
          }

          return (
            <span key={key} className={className}>
              {diff[1]}
            </span>
          );
        });
        setComparisonResult(
          <div>
            <p>Matching Percentage: {Math.round(matchPercentage)}%</p>
            {Math.round(matchPercentage) === 100 ? (
              <p>Perfecto!</p>
            ) : Math.round(matchPercentage) >= 70 ? (
              <p>Good job! But you can do better!</p>
            ) : (
              <p>Keep trying!</p>
            )}
            {diffElements}
          </div>
        );
      },
    }));

    return (
      <div>
        {comparisonResult ? (
          <div className="comparison">{comparisonResult}</div>
        ) : (
          <p></p>
        )}
      </div>
    );
  }
);

export default TextCompare;
