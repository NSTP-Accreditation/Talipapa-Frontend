import * as React from "react";

export function Sidebar({ className, ...props }: React.ComponentPropsWithRef<"aside">) {
	return <aside className={className} {...props} />;
}

export default Sidebar;

