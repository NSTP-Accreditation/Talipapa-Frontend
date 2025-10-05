import * as React from "react";

export function Breadcrumb({ className, ...props }: React.ComponentPropsWithRef<"nav">) {
	return <nav aria-label="Breadcrumb" className={className} {...props} />;
}

export default Breadcrumb;

