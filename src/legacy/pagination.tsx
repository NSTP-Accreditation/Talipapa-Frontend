// Simple pagination helper - keep as library agnostic stub for now
export function Pagination({ children, className, ...props }: any) {
	return (
		<nav className={className} {...props}>
			{children}
		</nav>
	);
}

export default Pagination;

