import * as React from "react";

export function Table({ className, ...props }: React.ComponentPropsWithRef<"table">) {
	return <table className={className} {...props} />;
}

export default Table;

