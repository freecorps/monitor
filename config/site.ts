export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Monitor",
	description: "Monitor - Um jeito fácil de monitorar seus sensores",
	navItems: [
		{
			label: "Home",
			href: "/",
		}, 
		{
			label: "monitor",
			href: "/monitor",
		}
	],
	navMenuItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Monitor",
			href: "/monitor",
		}
	],
	links: {
		github: "https://github.com/freecorps/monitor",
	},
};
