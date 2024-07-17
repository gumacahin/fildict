import parse from 'html-react-parser';

export const Hit = ({ hit }: {hit:{ entry: string;};}) => {
  const entry = parse(hit.entry);
  return (
    <article>
      <div className="hit-id">
			<div className="hit-entry">
			{entry}
			</div>
		</div>
    </article>
  );
};