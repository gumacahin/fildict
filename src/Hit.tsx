import parse from 'html-react-parser';
import { useEffect, useRef } from 'react';

export const Hit = ({ hit }) => {
  const ref = useRef();
  const entry = parse(hit.entry);
//   useEffect(() => {
// 	// Correct method to access the DOM element is ref.current
// 	const element = ref.current;
// 	if (element) {
// 		const clickHandler = (e) => {
// 			const newUrl = e.target.href
// 			history.replaceState(null, '', newUrl);
// 			e.preventDefault();
// 		};
// 		element.addEventListener('click', clickHandler);

// 		return () => {
// 			element.removeEventListener('click', clickHandler);
// 		};
// 	}
//   }, [ref]);
  return (
    <article>
      <div ref={ref} className="hit-id">
			<div className="hit-entry">
			{entry}
			</div>
		</div>
    </article>
  );
};